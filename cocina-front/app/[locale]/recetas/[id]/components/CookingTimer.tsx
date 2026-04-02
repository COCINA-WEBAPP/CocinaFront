"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type CookingTimerProps = {
  duration: number; // seconds
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CookingTimer({ duration }: CookingTimerProps) {
  const t = useTranslations("Timer");
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clear();
            setIsRunning(false);
            toast.success(t("done"), { duration: 5000 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clear;
  }, [isRunning, remaining, clear, t]);

  const progress = 1 - remaining / duration;
  const circumference = 2 * Math.PI * 18;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 border px-3 py-2">
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="20" cy="20" r="18" fill="none"
            stroke={remaining === 0 ? "#22c55e" : "#e07b39"}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">
          {formatTime(remaining)}
        </span>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsRunning(!isRunning)}
          disabled={remaining === 0}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            clear();
            setIsRunning(false);
            setRemaining(duration);
          }}
        >
          <RotateCcw size={14} />
        </Button>
      </div>
    </div>
  );
}
