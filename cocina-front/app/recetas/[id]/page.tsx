"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, Star, Heart, Share2, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id as string;
  const [isSaved, setIsSaved] = useState(false);

  // Buscar la receta por ID
  const recipe = MOCK_RECIPES.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Receta no encontrada</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Receta eliminada de favoritos" : "Receta guardada en favoritos");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };

  const handlePrint = () => {
    window.print();
  };

  const reviewCount = recipe.reviews.length;
  const avgRating = recipe.rating;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Image */}
   
        <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-xl md:h-[500px]">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badges on image */}
          <div className="absolute left-4 top-4 flex gap-2">
            {recipe.isNew && (
              <Badge className="bg-blue-500 text-white">Nuevo</Badge>
            )}
            {recipe.isFeatured && (
              <Badge className="bg-purple-500 text-white">Destacado</Badge>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">{recipe.title}</h1>
            <p className="text-lg opacity-90">{recipe.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button onClick={handleSave} variant={isSaved ? "default" : "outline"}>
            <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Guardado" : "Guardar"}
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col items-center rounded-lg border p-4">
                    <Clock className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Tiempo</span>
                    <span className="font-semibold">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border p-4">
                    <Users className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Porciones</span>
                    <span className="font-semibold">{recipe.servings}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border p-4">
                    <ChefHat className="mb-2 h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Dificultad</span>
                    <span className="font-semibold">{recipe.difficulty}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border p-4">
                    <Star className="mb-2 h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="font-semibold">{avgRating.toFixed(1)}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Creado por</p>
                    <p className="font-semibold">{recipe.author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Ingredientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reseñas ({reviewCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipe.reviews.map((review, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold">{review.user}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            {recipe.comments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comentarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recipe.comments.map((comment, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold">{comment.user}</span>
                          <span className="text-sm text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="mb-2 text-sm">{comment.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>👍 {comment.likeCount}</span>
                          <span>👎 {comment.dislikeCount}</span>
                        </div>
                        
                        {/* Answers */}
                        {comment.answers.length > 0 && (
                          <div className="ml-6 mt-4 space-y-3 border-l-2 border-muted pl-4">
                            {comment.answers.map((answer, answerIndex) => (
                              <div key={answerIndex} className="rounded-lg bg-muted p-3">
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-sm font-semibold">{answer.user}</span>
                                  <span className="text-xs text-muted-foreground">{answer.date}</span>
                                </div>
                                <p className="text-sm">{answer.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base">
                  {recipe.category}
                </Badge>
              </CardContent>
            </Card>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Etiquetas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Calificación promedio</span>
                  <span className="font-semibold">{avgRating.toFixed(1)}/5</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de reseñas</span>
                  <span className="font-semibold">{reviewCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Comentarios</span>
                  <span className="font-semibold">{recipe.comments.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
    
  );
}


      