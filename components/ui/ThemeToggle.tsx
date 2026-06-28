"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("fagurul-de-aur-theme", next ? "light" : "dark");
    } catch {
      // localStorage unavailable (private mode) — theme just won't persist
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative p-2.5 text-text-secondary hover:text-gold-300 transition-colors"
      aria-label={isLight ? "Comută la tema întunecată" : "Comută la tema deschisă"}
      title={isLight ? "Temă întunecată" : "Temă deschisă"}
    >
      {/* Reserve space before mount to avoid layout shift */}
      <span className="block w-5 h-5">
        {mounted && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isLight ? "moon" : "sun"}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="block"
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </button>
  );
}
