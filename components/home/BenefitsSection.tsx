"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const benefits = [
  {
    icon: "leaf",
    title: "100% Naturală",
    desc: "Fără antibiotice, fără zahăr adăugat, fără chimicale. Miere pură, garantat.",
  },
  {
    icon: "mountain",
    title: "Origine Certificată",
    desc: "Recoltată exclusiv din România, din zone nepoluate și protejate ecologic.",
  },
  {
    icon: "jar",
    title: "Recoltare Manuală",
    desc: "Fiecare borcan este umplut cu grijă, prin extracție la rece, fără procesare termică.",
  },
  {
    icon: "box",
    title: "Livrare Rapidă",
    desc: "Livrăm în toată România în 24–48h.",
  },
  {
    icon: "recycle",
    title: "Ambalaj Eco",
    desc: "Borcane de sticlă reutilizabile, capace metalice, etichete pe hârtie reciclată.",
  },
  {
    icon: "shield",
    title: "Garanție Puritate",
    desc: "100% miere naturală sau banii înapoi. Garantăm autenticitatea fiecărui produs.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  leaf: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 26 C6 26, 10 16, 20 10 C26 6, 28 6, 28 6 C28 6, 28 8, 24 14 C18 24, 10 28, 6 26Z" stroke="#D4A017" strokeWidth="1.5" fill="rgba(212,160,23,0.12)" strokeLinejoin="round" />
      <line x1="6" y1="26" x2="16" y2="16" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mountain: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M3 26 L12 8 L21 18 L26 12 L29 26Z" stroke="#D4A017" strokeWidth="1.5" fill="rgba(212,160,23,0.1)" strokeLinejoin="round" />
      <path d="M3 26 L29 26" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  jar: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="10" y="4" width="12" height="4" rx="1" stroke="#D4A017" strokeWidth="1.5" />
      <path d="M7 10 Q7 8, 9 8 L23 8 Q25 8, 25 10 L27 26 Q27 28, 25 28 L7 28 Q5 28, 5 26Z" stroke="#D4A017" strokeWidth="1.5" fill="rgba(212,160,23,0.1)" />
      <path d="M7 17 L25 17" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  box: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="12" width="24" height="16" rx="2" stroke="#D4A017" strokeWidth="1.5" fill="rgba(212,160,23,0.1)" />
      <path d="M4 12 L8 6 L24 6 L28 12" stroke="#D4A017" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="16" y1="12" x2="16" y2="28" stroke="#D4A017" strokeWidth="1.5" opacity="0.5" />
      <path d="M10 6 L13 12" stroke="#D4A017" strokeWidth="1" opacity="0.5" />
      <path d="M22 6 L19 12" stroke="#D4A017" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  recycle: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L12 10 L16 10 C20 10, 24 14, 24 18" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 24 L28 18 L24 18 C20 18, 16 22, 12 22" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 18 L4 24 L8 24 C12 24, 16 20, 16 16" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L28 8 L28 18 C28 24, 22 28, 16 30 C10 28, 4 24, 4 18 L4 8Z" stroke="#D4A017" strokeWidth="1.5" fill="rgba(212,160,23,0.1)" strokeLinejoin="round" />
      <path d="M10 16 L14 20 L22 12" stroke="#D4A017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg-primary"
      aria-label="De ce Fagurul de Aur"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="gold-line" />
          <h2 className="section-heading font-heading">De Ce Fagurul de Aur</h2>
          <p className="section-subheading">
            Șase motive pentru care mierea noastră este diferită.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              className="card p-6 flex flex-col gap-4"
            >
              <div className="w-14 h-14 rounded-sm bg-bg-elevated border border-gold-400/15 flex items-center justify-center">
                {iconMap[b.icon]}
              </div>
              <div>
                <h3 className="font-heading text-xl text-text-primary mb-1">{b.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
