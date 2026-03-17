"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { getCurrentUser } from "@/lib/services/user";
import { getRecipeById, updateRecipe, getUserTags } from "@/lib/services/recipe";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { CreateRecipeData, Recipe, RecipeStep } from "@/lib/types/recipes";
import { normalizeStep } from "@/lib/types/recipes";
import { X, Upload, Plus, Trash2, LinkIcon, ImageIcon, Tag } from "lucide-react";

// ─── Local types ──────────────────────────────────────────────────────────────

type ImageSource =
  | { type: "url"; value: string }
  | { type: "file"; file: File; preview: string };

interface IngredientRow {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface StepRow {
  id: string;
  text: string;
  images: ImageSource[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_OPTIONS = [
  "Otros", "g", "kg", "ml", "l", "tsp", "tbsp", "taza", "oz", "lb",
  "unidad", "pizca", "al gusto",
];

const PRESET_TAGS = ["Italiana", "Mexicana", "Desayuno", "Cena", "Saludable", "Postre"];
const DIFFICULTY_OPTIONS: CreateRecipeData["difficulty"][] = ["Fácil", "Intermedio", "Difícil"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse a serialized ingredient string like "200 g harina" back into row fields.
 * Falls back gracefully if the format doesn't match.
 */
function parseIngredientString(raw: string): IngredientRow {
  const parts = raw.trim().split(/\s+/);
  const knownUnits = UNIT_OPTIONS.filter((u) => u !== "Otros");

  if (parts.length >= 3 && knownUnits.includes(parts[1])) {
    return { id: crypto.randomUUID(), quantity: parts[0], unit: parts[1], name: parts.slice(2).join(" ") };
  }
  if (parts.length >= 2 && !isNaN(Number(parts[0]))) {
    return { id: crypto.randomUUID(), quantity: parts[0], unit: "Otros", name: parts.slice(1).join(" ") };
  }
  return { id: crypto.randomUUID(), quantity: "", unit: "Otros", name: raw };
}

// ─── Image Input Modal ────────────────────────────────────────────────────────

function ImageInputModal({
  onAdd,
  onClose,
}: {
  onAdd: (src: ImageSource) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd({ type: "file", file, preview: URL.createObjectURL(file) });
    onClose();
  };

  const commitUrl = () => {
    if (url.trim()) { onAdd({ type: "url", value: url.trim() }); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Agregar imagen</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 mb-5">
          {(["url", "file"] as const).map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === tb
                  ? "border-[#2d6a4f] text-[#2d6a4f]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tb === "url" ? <><LinkIcon size={14} /> URL</> : <><ImageIcon size={14} /> Archivo local</>}
            </button>
          ))}
        </div>

        {tab === "url" ? (
          <div className="space-y-3">
            <Input
              placeholder="https://ejemplo.com/imagen.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitUrl()}
              className="border-gray-300 focus:border-[#2d6a4f] focus:ring-[#2d6a4f]"
            />
            <Button onClick={commitUrl} disabled={!url.trim()}
              className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white">
              Agregar URL
            </Button>
          </div>
        ) : (
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#2d6a4f] hover:bg-[#f0faf5] transition-colors">
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm text-gray-500 text-center">Haz clic para seleccionar una imagen de tu computador</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP hasta 10 MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Image Thumbnail ──────────────────────────────────────────────────────────

function ImageThumb({ src, onRemove }: { src: ImageSource; onRemove: () => void }) {
  const url = src.type === "url" ? src.value : src.preview;
  return (
    <div className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="w-full h-full object-cover" />
      <button onClick={onRemove}
        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={16} className="text-white" />
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: {
  title: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-bold text-gray-800">{title}</h2>
      {action && (
        <button type="button" onClick={action.onClick}
          className="text-sm text-[#e07b39] hover:text-[#c4612a] font-medium flex items-center gap-1 transition-colors">
          <Plus size={14} />{action.label}
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditRecipePage() {
  const t = useTranslations("RecipeForm");
  const tAccount = useTranslations("Account");
  const tRecipe = useTranslations("Recipe");
  const router = useRouter();
  const params = useParams();
  const recipeId = (params as { id: string }).id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userTags, setUserTags] = useState<string[]>([]);

  // ── Form state ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cookTime, setCookTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0); // ← FIX: estado propio para proteína
  const [servings, setServings] = useState(1); // ← servings queda separado
  const [difficulty, setDifficulty] = useState<CreateRecipeData["difficulty"]>("Fácil");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: crypto.randomUUID(), name: "", quantity: "", unit: "Otros" },
  ]);
  const [steps, setSteps] = useState<StepRow[]>([
    { id: crypto.randomUUID(), text: "", images: [] },
  ]);
  const [stepImageModalId, setStepImageModalId] = useState<string | null>(null);

  // ── Image state ──
  const [mainPhoto, setMainPhoto] = useState<ImageSource | null>(null);
  const [gallery, setGallery] = useState<ImageSource[]>([]);
  const [showMainModal, setShowMainModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // ── Tag state ──
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  // ── Load recipe and prefill form ──
  useEffect(() => {
    const user = getCurrentUser();
    const found = getRecipeById(recipeId);

    if (!user) { setIsAuthorized(false); return; }
    if (!found) { setRecipe(null); setIsAuthorized(true); return; }
    if (found.author.username !== user.username) { setIsAuthorized(false); return; }

    setRecipe(found);
    setIsAuthorized(true);
    setUserTags(getUserTags());

    // ── Prefill all form fields ──
    setTitle(found.title);
    setDescription(found.description);
    setCategory(found.category);
    setCookTime(found.cookTime);
    setCalories(found.calories);
    setProtein(found.protein ?? 0); // ← FIX: prefill proteína correctamente
    setServings(found.servings);    // ← FIX: prefill porciones correctamente
    setDifficulty(found.difficulty);
    setSelectedTags(found.tags ?? []);

    // Parse ingredients back into rows
    if (found.ingredients.length > 0) {
      setIngredients(found.ingredients.map(parseIngredientString));
    }

    // Images: first = main photo, rest = gallery
    if (found.images.length > 0) {
      setMainPhoto({ type: "url", value: found.images[0] });
      setGallery(found.images.slice(1).map((url) => ({ type: "url", value: url })));
    }

    if (found.steps?.length) {
  setSteps(found.steps.map((s) => {
    const ns = normalizeStep(s);
    return { id: crypto.randomUUID(), text: ns.text, images: ns.images.map((url) => ({ type: "url" as const, value: url })) };
  }));
}

// Etiquetas de la receta que no están en PRESET_TAGS ni userTags → customTags
const knownTags = new Set([...PRESET_TAGS, ...getUserTags()]);
const recipCustomTags = (found.tags ?? []).filter((t) => !knownTags.has(t));
if (recipCustomTags.length > 0) {
  setCustomTags(recipCustomTags);
}

  }, [recipeId]);

  // ── Auth/loading guards ──────────────────────────────────────────────────────

  if (isAuthorized === null) return null;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>{tAccount("notLoggedIn")}</CardTitle>
                <CardDescription>{tAccount("loginRequired")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/login")}>{tAccount("goToLogin")}</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0 flex items-center justify-center">
          <p className="text-muted-foreground">{tRecipe("notFound")}</p>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  // ── Form helpers ──────────────────────────────────────────────────────────────

  const resolveUrl = (src: ImageSource) => (src.type === "url" ? src.value : src.preview);

  const allImages = (): string[] => [
    ...(mainPhoto ? [resolveUrl(mainPhoto)] : []),
    ...gallery.map(resolveUrl),
  ];

  const serializeIngredients = (): string[] =>
    ingredients
      .filter((r) => r.name.trim())
      .map((r) => {
        const parts = [r.quantity.trim(), r.unit !== "Otros" ? r.unit : "", r.name.trim()].filter(Boolean);
        return parts.join(" ");
      });

  const allTags = Array.from(new Set([...PRESET_TAGS, ...userTags, ...customTags]));

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleAddNewTag = () => {
    const tag = newTagInput.trim();
    if (!tag) return;
    if (!allTags.includes(tag)) setCustomTags((prev) => [...prev, tag]);
    if (!selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag]);
    setNewTagInput("");
  };

  const updateIngredient = (id: string, field: keyof IngredientRow, val: string) =>
    setIngredients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const removeIngredient = (id: string) =>
    setIngredients((prev) => prev.filter((r) => r.id !== id));
  const addIngredient = () =>
    setIngredients((prev) => [...prev, { id: crypto.randomUUID(), name: "", quantity: "", unit: "Otros" }]);

  const updateStep = (id: string, val: string) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, text: val } : s)));
  const removeStep = (id: string) =>
    setSteps((prev) => prev.filter((s) => s.id !== id));
  const addStep = () =>
    setSteps((prev) => [...prev, { id: crypto.randomUUID(), text: "", images: [] }]);
  const addStepImage = (stepId: string, img: ImageSource) =>
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, images: [...s.images, img] } : s));
  const removeStepImage = (stepId: string, imgIdx: number) =>
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, images: s.images.filter((_, i) => i !== imgIdx) } : s));

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("El nombre de la receta es obligatorio."); return; }
    setIsLoading(true);
    try {
      const data: CreateRecipeData = {
        title: title.trim(),
        description: description.trim(),
        images: allImages(),
        category: category.trim() || "General",
        cookTime,
        calories,
        protein,  // ← FIX: proteína correcta
        servings, // ← FIX: porciones correctas
        difficulty,
        tags: selectedTags,
        ingredients: serializeIngredients(),
        steps: steps
          .filter((s) => s.text.trim() !== "")
          .map((s) => ({ text: s.text, images: s.images.map(resolveUrl) })),
      };
      await updateRecipe(recipeId, data);
      toast.success(t("recipeUpdated"));
      router.push(`/recetas/${recipeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  const inputCls = "border-gray-300 focus:border-[#2d6a4f] focus:ring-[#2d6a4f]";
  const selectCls =
    "h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-[#2d6a4f] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f] bg-white";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">

        {/* Modals */}
        {showMainModal && (
          <ImageInputModal onAdd={(s) => setMainPhoto(s)} onClose={() => setShowMainModal(false)} />
        )}
        {showGalleryModal && (
          <ImageInputModal
            onAdd={(s) => setGallery((prev) => [...prev, s])}
            onClose={() => setShowGalleryModal(false)}
          />
        )}
        {stepImageModalId && (
          <ImageInputModal
            onAdd={(s) => addStepImage(stepImageModalId, s)}
            onClose={() => setStepImageModalId(null)}
          />
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#2d6a4f]">Editar Receta</h1>
            <button onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={22} />
            </button>
          </div>

          <div className="space-y-7">

            {/* ── Row 1: Left fields + Right main photo ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Nombre de la receta</Label>
                  <Input placeholder="Ej: Pasta Carbonara" value={title}
                    onChange={(e) => setTitle(e.target.value)} className={inputCls} />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</Label>
                  <Textarea placeholder="Describe tu receta..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4} className={`${inputCls} resize-none`} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block leading-tight">
                      Tiempo de cocción (min)
                    </Label>
                    <Input type="number" min={0} value={cookTime}
                      onChange={(e) => setCookTime(Number(e.target.value))} className={inputCls} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">Calorías</Label>
                    <Input type="number" min={0} value={calories}
                      onChange={(e) => setCalories(Number(e.target.value))} className={inputCls} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">Proteína (g)</Label>
                    {/* ← FIX: usa protein, no servings */}
                    <Input type="number" min={0} value={protein}
                      onChange={(e) => setProtein(Number(e.target.value))} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">Categoría</Label>
                    <Input placeholder="Ej: Italiana" value={category}
                      onChange={(e) => setCategory(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">Dificultad</Label>
                    <select value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as CreateRecipeData["difficulty"])}
                      className={`w-full ${selectCls}`}>
                      {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Main Photo */}
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => setShowMainModal(true)}
                  className="relative w-full flex-1 min-h-[220px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#2d6a4f] hover:bg-[#f0faf5] transition-colors overflow-hidden bg-gray-50">
                  {mainPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveUrl(mainPhoto)} alt="Foto principal"
                      className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">Subir Foto Principal</span>
                    </>
                  )}
                </button>
                {mainPhoto && (
                  <button onClick={() => setMainPhoto(null)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 self-start transition-colors">
                    <Trash2 size={12} /> Quitar foto
                  </button>
                )}
              </div>
            </div>

            {/* ── Gallery ── */}
            <div>
              <SectionHeader
                title="Galería de imágenes"
                action={{ label: "Agregar imagen a galería", onClick: () => setShowGalleryModal(true) }}
              />
              {gallery.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No hay fotos adicionales</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {gallery.map((img, idx) => (
                    <ImageThumb key={idx} src={img}
                      onRemove={() => setGallery((prev) => prev.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* ── Ingredients ── */}
            <div>
              <SectionHeader
                title="Lista de ingredientes"
                action={{ label: "Agregar ingrediente", onClick: addIngredient }}
              />
              <div className="space-y-2">
                {ingredients.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <Input placeholder="Nombre del ingrediente" value={row.name}
                      onChange={(e) => updateIngredient(row.id, "name", e.target.value)}
                      className={`flex-1 ${inputCls} text-sm`} />
                    <Input placeholder="Cantidad" value={row.quantity}
                      onChange={(e) => updateIngredient(row.id, "quantity", e.target.value)}
                      className={`w-24 ${inputCls} text-sm`} />
                    <select value={row.unit}
                      onChange={(e) => updateIngredient(row.id, "unit", e.target.value)}
                      className={`w-28 ${selectCls} text-sm`}>
                      {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <button onClick={() => removeIngredient(row.id)}
                      className="text-red-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* ── Steps ── */}
            <div>
              <SectionHeader
                title="Pasos de preparación"
                action={{ label: "Agregar paso", onClick: addStep }}
              />
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <span className="mt-2.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#2d6a4f] text-white text-xs flex items-center justify-center font-semibold">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <Textarea placeholder={`Describe el paso ${idx + 1}...`} value={step.text}
                        onChange={(e) => updateStep(step.id, e.target.value)}
                        rows={2} className={`${inputCls} resize-none text-sm`} />
                      {/* Step images */}
                      <div className="flex flex-wrap items-center gap-2">
                        {step.images.map((img, imgIdx) => (
                          <ImageThumb key={imgIdx} src={img}
                            onRemove={() => removeStepImage(step.id, imgIdx)} />
                        ))}
                        <button type="button" onClick={() => setStepImageModalId(step.id)}
                          className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#2d6a4f] hover:text-[#2d6a4f] hover:bg-[#f0faf5] transition-colors">
                          <ImageIcon size={16} />
                          <span className="text-[10px] font-medium">Foto</span>
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeStep(step.id)}
                      className="mt-2.5 text-red-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* ── Tags ── */}
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-3">Etiquetas</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {allTags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        active
                          ? "bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-sm"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                      }`}>
                      {active && <span className="mr-1">✓</span>}
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input placeholder="Crear nueva etiqueta..." value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNewTag(); } }}
                    className={`pl-8 ${inputCls} text-sm`} />
                </div>
                <Button type="button" onClick={handleAddNewTag} disabled={!newTagInput.trim()}
                  variant="outline"
                  className="border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#f0faf5] disabled:opacity-40 text-sm whitespace-nowrap">
                  <Plus size={14} className="mr-1" /> Crear
                </Button>
              </div>

              {selectedTags.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Seleccionadas: {selectedTags.join(", ")}
                </p>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* ── Actions ── */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-6">
              <Button type="button" variant="outline" onClick={() => router.back()}
                className="border-gray-300 text-gray-600 hover:bg-gray-50">
                Cancelar
              </Button>
              <Button type="button" onClick={handleSubmit}
                disabled={isLoading || !title.trim()}
                className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 disabled:opacity-50">
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}