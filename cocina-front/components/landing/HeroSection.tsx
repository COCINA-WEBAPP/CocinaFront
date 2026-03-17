"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Flame } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const TRENDING = ["Tacos al pastor", "Pasta carbonara", "Arroz con leche", "Ceviche"];

export function HeroSection() {
  const t = useTranslations('Hero');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const col1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const col2Y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/es/Explorar?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTrending = (term: string) => {
    router.push(`/es/Explorar?search=${encodeURIComponent(term)}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[680px] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fff8f3 0%, #ffffff 50%, #fff3e8 100%)" }}
    >
      {/* Decorative background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #e85c05 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-10 right-0 w-[380px] h-[380px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #ffd1a1 0%, transparent 70%)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#e85c05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ background: i % 2 === 0 ? "#e85c05" : "#ffd1a1", opacity: 0.2 }}
          animate={{ x: [0, Math.sin(i * 60) * 30, 0], y: [0, -20 - i * 8, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          initial={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
              style={{ background: "linear-gradient(90deg, #fff3e8, #ffecd8)", borderColor: "#ffd1a1", color: "#e85c05" }}
            >
              <Flame className="w-3.5 h-3.5" />
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight"
              style={{ color: "#1a1109" }}
            >
              {t('headingLine1')}
              <br />
              {t('headingLine2')}
              <motion.span
                className="block"
                style={{ color: "#e85c05" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t('headingAccent')}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg mb-8 max-w-md leading-relaxed"
              style={{ color: "#6b5c4c" }}
            >
              {t('description')}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-5"
            >
              <div
                className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl border transition-all duration-300"
                style={{
                  background: "white",
                  borderColor: focused ? "#e85c05" : "#f0e0d0",
                  boxShadow: focused
                    ? "0 0 0 4px rgba(232,92,5,0.1), 0 4px 24px rgba(232,92,5,0.08)"
                    : "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                    style={{ color: focused ? "#e85c05" : "#b09080" }}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent focus:outline-none text-base"
                    style={{ color: "#1a1109" }}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="px-7 py-3.5 h-auto rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #e85c05 0%, #c44d00 100%)",
                    boxShadow: "0 4px 14px rgba(232,92,5,0.35)",
                  }}
                >
                  {t('searchButton')}
                </Button>
              </div>
            </motion.div>

            {/* Trending pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-2 items-center"
            >
              <span className="text-xs font-medium" style={{ color: "#b09080" }}>{t('trendingLabel')}</span>
              {TRENDING.map((term, i) => (
                <motion.button
                  key={term}
                  onClick={() => handleTrending(term)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200"
                  style={{ background: "#fff8f3", borderColor: "#ffd1a1", color: "#c44d00" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fff0e0";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e85c05";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fff8f3";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffd1a1";
                  }}
                >
                  {term}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Image Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 items-start">
            <motion.div
              className="space-y-4"
              style={{ y: col1Y }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="relative h-48 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1619592982310-7b7d51e4207f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBwYW5jYWtlcyUyMHN5cnVwfGVufDF8fHx8MTc3MzY4NzQyMXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pancakes"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwaGVhbHRoeXxlbnwxfHx8fDE3NzM3NTI0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Salad"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-4 pt-8"
              style={{ y: col2Y }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <motion.div
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NzM2OTc3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Chocolate Cake"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="relative h-48 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1609166639722-47053ca112ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW4lMjBjdWlzaW5lfGVufDF8fHx8MTc3MzcyNzgwNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pasta"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="col-span-2 h-1 rounded-full origin-left"
              style={{ background: "linear-gradient(90deg, #e85c05, #ffd1a1, transparent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}