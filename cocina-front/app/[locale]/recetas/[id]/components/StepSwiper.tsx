"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RecipeStep } from "@/lib/types/recipes";
import { normalizeStep } from "@/lib/types/recipes";
import { StepCard } from "./StepCard";

type StepSwiperProps = {
  steps: (string | RecipeStep)[];
};

const swipeVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export function StepSwiper({ steps: rawSteps }: StepSwiperProps) {
  const t = useTranslations("Steps");
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const steps = rawSteps.map(normalizeStep);
  const totalSteps = steps.length;

  if (totalSteps === 0) {
    return <p className="text-gray-400 italic text-sm">{t("noSteps")}</p>;
  }

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goPrev = () => goTo(Math.max(0, currentIndex - 1));
  const goNext = () => goTo(Math.min(totalSteps - 1, currentIndex + 1));

  // Desktop: vertical scrollable list
  if (!isMobile) {
    return (
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <StepCard key={idx} step={step} stepNumber={idx + 1} totalSteps={totalSteps} />
        ))}
      </div>
    );
  }

  // Mobile: swipeable single-step view
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-[#e07b39] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Swipeable card */}
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -5000 && currentIndex < totalSteps - 1) goNext();
              else if (swipe > 5000 && currentIndex > 0) goPrev();
            }}
          >
            <StepCard
              step={steps[currentIndex]}
              stepNumber={currentIndex + 1}
              totalSteps={totalSteps}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={16} className="mr-1" />
          {t("previous")}
        </Button>

        <span className="text-sm text-gray-500 font-medium">
          {t("stepOf", { current: currentIndex + 1, total: totalSteps })}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
        >
          {t("next")}
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
