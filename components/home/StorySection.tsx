"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

const stats = [
  { value: 15, suffix: "+", label: "ani de apicultură" },
  { value: 200, suffix: "+", label: "familii de albine" },
  { value: 8, suffix: "", label: "soiuri de miere" },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const count = useCountUp(value, isVisible);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-5xl text-gold-300 leading-none">
        {count}
        {suffix}
      </div>
      <p className="text-text-muted text-sm mt-1 font-body">{label}</p>
    </div>
  );
}

export function StorySection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg-secondary overflow-hidden"
      aria-label="Povestea stupinei"
    >
      {/* Gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(212,160,23,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="block w-12 h-px bg-gold-400 mb-6" aria-hidden="true" />
            <h2 className="font-heading text-text-primary mb-6">
              Albine fericite.{" "}
              <span className="text-gradient-gold">Miere excepțională.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Fagurul de Aur a luat naștere dintr-o pasiune profundă pentru natură și respectul față de
              acele ființe minuscule care hrănesc planeta. Stupina noastră se află în mijlocul
              naturii, într-un loc unde aerul este curat, florile sunt sălbatice și niciun chimical
              nu perturbă echilibrul natural.
            </p>
            <p className="text-text-secondary leading-relaxed mb-8">
              Nu folosim antibiotice, nu adăugăm zahăr, nu forțăm producția. Fiecare borcan de miere
              Fagurul de Aur reprezintă munca a mii de albine libere, care zboară printre lavandă și
              sunătoare, tei și salcâm, și aduc acasă esența pură a florilor sălbatice.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gold-400/12">
              {stats.map((s) => (
                <StatItem key={s.label} {...s} />
              ))}
            </div>
          </motion.div>

          {/* Honeycomb photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <Image
              src="/images/fagure.jpg"
              alt="Fagure de miere căpăcit, recoltat în stupina Fagurul de Aur"
              width={1440}
              height={1080}
              className="rounded-lg shadow-xl w-full max-w-md h-auto object-cover border border-gold-400/10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
