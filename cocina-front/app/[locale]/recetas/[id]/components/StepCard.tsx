"use client";

import type { RecipeStep } from "@/lib/types/recipes";
import { parseStepDuration } from "@/lib/utils/step-time-parser";
import { CookingTimer } from "./CookingTimer";
import { useTranslations } from "next-intl";
import {
  Flame,
  Soup,
  Scissors,
  Snowflake,
  Droplets,
  UtensilsCrossed,
} from "lucide-react";

type StepCardProps = {
  step: RecipeStep;
  stepNumber: number;
  totalSteps: number;
};

const ICON_PATTERNS: [RegExp, typeof Flame][] = [
  [/hornea|bake|cuire|four|horno|oven/i, Flame],
  [/mezcla|mix|m[eé]langer|batir|whisk|blend|fouett/i, Soup],
  [/corta|cut|couper|picar|chop|dice|troc/i, Scissors],
  [/refrigera|chill|refroidir|nevera|enfr[ií]|fridge|congel|freez/i, Snowflake],
  [/hierve|boil|bouillir|herv|ebull|simmer/i, Droplets],
];

function getStepIcon(text: string) {
  for (const [pattern, Icon] of ICON_PATTERNS) {
    if (pattern.test(text)) return Icon;
  }
  return UtensilsCrossed;
}

export function StepCard({ step, stepNumber, totalSteps }: StepCardProps) {
  const t = useTranslations("Steps");
  const duration = parseStepDuration(step.text);
  const Icon = getStepIcon(step.text);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#e07b39] text-white flex items-center justify-center font-bold text-sm">
          {stepNumber}
        </div>
        <Icon size={18} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-400 ml-auto">
          {t("stepOf", { current: stepNumber, total: totalSteps })}
        </span>
      </div>

      <p className="text-gray-800 leading-relaxed">{step.text}</p>

      {step.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {step.images.map((img, idx) => (
            <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={img}
                alt={`${t("stepOf", { current: stepNumber, total: totalSteps })} - ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {duration !== null && <CookingTimer duration={duration} />}
    </div>
  );
}
