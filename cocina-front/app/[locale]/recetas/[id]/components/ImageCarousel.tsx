// components/ImageCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  title?: string;
  interval?: number;
  height?: string; 
}

export const ImageCarousel = ({
  images,
  title,
  interval = 5000,
  height = "h-[400px]",
}: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<number | null>(null);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 250);
  };

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
      setFade(true);
    }, 250);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = window.setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  const pause = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resume = () => {
    if (!timerRef.current && images.length > 1) {
      timerRef.current = window.setInterval(next, interval);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative ${height} w-full rounded-xl bg-muted`} />
    );
  }

  return (
    <div
      className={`relative ${height} w-full overflow-hidden rounded-xl border`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
        <ImageWithFallback
          src={images[current]}
          alt={`Fondo ${current + 1}`}
          className="h-full w-full object-cover blur-3xl scale-125"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
        <ImageWithFallback
          src={images[current]}
          alt={`Imagen ${current + 1}`}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

      {title && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            {title}
          </h1>
        </div>
      )}

      {images.length > 1 && (
        <button
          onClick={prev}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {images.length > 1 && (
        <button
          onClick={next}
          aria-label="Imagen siguiente"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-6 rounded-full transition-all ${
                i === current ? "bg-primary" : "bg-white/50"
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
