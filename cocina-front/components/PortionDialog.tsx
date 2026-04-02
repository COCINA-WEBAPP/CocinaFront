"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { scaleIngredients } from "@/lib/utils/ingredient-parser";

type PortionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  originalServings: number;
  ingredients: string[];
  onConfirm: (scaledIngredients: string[], targetServings: number) => void;
};

export function PortionDialog({
  open,
  onOpenChange,
  recipeTitle,
  originalServings,
  ingredients,
  onConfirm,
}: PortionDialogProps) {
  const t = useTranslations("PortionDialog");
  const [targetServings, setTargetServings] = useState(originalServings);

  const scaledIngredients = useMemo(
    () => scaleIngredients(ingredients, originalServings, targetServings),
    [ingredients, originalServings, targetServings]
  );

  const handleConfirm = () => {
    onConfirm(scaledIngredients, targetServings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{recipeTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setTargetServings((s) => Math.max(1, s - 1))}
              disabled={targetServings <= 1}
            >
              <Minus size={18} />
            </Button>
            <div className="text-center min-w-[80px]">
              <span className="text-3xl font-bold text-[#2d6a4f]">
                {targetServings}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {t("servings")}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setTargetServings((s) => Math.min(50, s + 1))}
              disabled={targetServings >= 50}
            >
              <Plus size={18} />
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto rounded-lg border bg-gray-50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("preview")}
            </p>
            <ul className="space-y-1.5">
              {scaledIngredients.map((ingredient, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2d6a4f] flex-shrink-0" />
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white"
            onClick={handleConfirm}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
