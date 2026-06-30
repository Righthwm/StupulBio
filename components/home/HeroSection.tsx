"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BeeAnimation } from "@/components/animations/BeeAnimation";
import { ParticleField } from "@/components/animations/ParticleField";
import { HoneyJar } from "@/components/ui/HoneyJar";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay } },
});

const blurReveal = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, ease: "easeOut" as const, delay: 0.2 } },
};

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen"
      aria-label="Secțiunea hero Fagurul de Aur"
    >
      <div
        className="h-screen flex items-center overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-glow)" }}
          aria-hidden="true"
        />

        {/* Floating hex particles */}
        <ParticleField count={32} />

        {/* Bee animation layer */}
        <BeeAnimation />

        {/* Left: Real apiary hive photo */}
        <motion.div
          id="hero-hive"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
          className="absolute left-0 sm:left-2 lg:left-8 bottom-0 w-[200px] sm:w-[280px] lg:w-[370px] pointer-events-none select-none"
          aria-hidden="true"
        >
          {/* Warm glow grounding the hive into the scene */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gold-400/15 blur-3xl rounded-[50%]" />
          <Image
            src="/images/stup.png"
            alt="Stup de albine din stupina Fagurul de Aur, Gorj — apicultură pastorală"
            width={287}
            height={390}
            priority
            className="photo-blend relative w-full h-auto [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)]"
          />
        </motion.div>

        {/* Right: Real flower bunch photo */}
        <motion.div
          id="hero-flowers"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: "easeOut" }}
          className="absolute right-0 sm:right-2 lg:right-6 bottom-0 w-[210px] sm:w-[290px] lg:w-[370px] pointer-events-none select-none"
          aria-hidden="true"
        >
          {/* Warm glow grounding the bunch into the scene */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gold-400/15 blur-3xl rounded-[50%]" />
          <Image
            src="/images/musetel.png"
            alt="Flori de mușețel, sursă de nectar pentru miere poliflora naturală"
            width={760}
            height={807}
            priority
            className="photo-blend relative w-full h-auto [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
          />
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center pt-28 pb-24">
          {/* Skip to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 btn-primary text-xs"
          >
            Sari la conținut principal
          </a>

          <motion.p
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="font-body text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-gold-300 mb-4"
          >
            Miere Pură, Direct din Stupină
          </motion.p>

          <motion.div
            variants={blurReveal}
            initial="hidden"
            animate="visible"
            className="mb-8 flex justify-center"
          >
            <h1 className="sr-only">
              Fagurul de Aur — miere naturală pură, recoltată manual în România
            </h1>
            <motion.div
              id="hero-jar"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Full jar with lid */}
              <HoneyJar
                color="#D89A28"
                variant="hero"
                width={280}
                className="w-[200px] sm:w-[240px] lg:w-[280px] h-auto"
              />
            </motion.div>
          </motion.div>

          <motion.p
            variants={fadeUp(0.55)}
            initial="hidden"
            animate="visible"
            className="font-body text-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Recoltată manual în Gorj, fără antibiotice și fără zahăr. Livrată la tine în 24–48h.
          </motion.p>

          <motion.div
            variants={fadeUp(0.75)}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/magazin" className="btn-primary">
              Descoperă Mierea
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-16 flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-400/40" />
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ScrollBee />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ScrollBee() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <ellipse cx="10" cy="8" rx="5.5" ry="4" fill="#D4A017" />
      <ellipse cx="10" cy="8" rx="5.5" ry="4" fill="url(#sb)" opacity="0.5" />
      <circle cx="10" cy="3.5" r="3" fill="#D4A017" />
      <ellipse cx="4" cy="7" rx="5" ry="2.5" fill="#D4A017" fillOpacity="0.35" transform="rotate(-15 4 7)" />
      <ellipse cx="16" cy="7" rx="5" ry="2.5" fill="#D4A017" fillOpacity="0.35" transform="rotate(15 16 7)" />
      <defs>
        <pattern id="sb" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="2" height="4" fill="rgba(0,0,0,0.3)" />
        </pattern>
      </defs>
    </svg>
  );
}
