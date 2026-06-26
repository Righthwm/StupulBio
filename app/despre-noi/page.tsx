"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HexPattern } from "@/components/ui/HexPattern";
import type { TimelineEvent } from "@/types";

const timeline: TimelineEvent[] = [
  { year: "2009", title: "Prima familie de albine", description: "Totul a început cu o singură familie de albine și o pasiune care nu mai putea fi ignorată. Primul cules, prima miere — nerafinată, naturală, perfectă." },
  { year: "2012", title: "Primii 50 de stupi", description: "Stupina a crescut organic, respectând ritmul natural al albinelor." },
  { year: "2020", title: "Puritate Garantată", description: "După ani de practici ecologice riguroase, garantăm puritatea naturală a fiecărui borcan. Niciun antibiotic, niciun tratament chimic — niciodată." },
  { year: "2024", title: "120 de familii de albine", description: "Stupina a atins o scală importantă, păstrând în același timp calitatea artizanală. Am investit în echipamente de extracție la rece și în ambalaje eco." },
  { year: "2026", title: "Stupul Bio online", description: "Mierea noastră ajunge acum direct la clienți din toată România. Povestea continuă — la fiecare borcan deschis, Mireasma florilor intră în casa ta." },
];

function TimelineSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary" aria-label="Istoria stupinei">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="gold-line" />
          <h2 className="font-heading text-text-primary">Povestea Noastră</h2>
        </div>

        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gold-400/20" aria-hidden="true">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gold-400"
              initial={{ height: "0%" }}
              animate={isVisible ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
            />
          </div>

          <ol className="space-y-10 pl-16">
            {timeline.map((event, i) => (
              <motion.li
                key={event.year}
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
                className="relative"
              >
                {/* Dot */}
                <div
                  className="absolute -left-[46px] w-4 h-4 rounded-full border-2 border-gold-400 bg-bg-primary flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </div>

                <time className="text-gold-300 font-body text-sm font-semibold tracking-wider block mb-1">
                  {event.year}
                </time>
                <h3 className="font-heading text-xl text-text-primary mb-2">{event.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{event.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function DespreNoiPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="bg-bg-primary pt-20">
      {/* Hero */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            ref={heroRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="block w-12 h-px bg-gold-400 mb-6" aria-hidden="true" />
              <h1 className="font-heading text-text-primary mb-6">
                O stupină cu{" "}
                <span className="text-gradient-gold">suflet</span>
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Stupul Bio nu este doar o afacere. Este o filosofie de viață — în armonie cu natura,
                cu albinele și cu pământul care ne-a dat totul.
              </p>

              <blockquote className="border-l-2 border-gold-400 pl-5 my-6">
                <p className="font-heading text-text-primary text-xl italic">
                  „Albinele nu produc miere pentru noi. Noi avem privilegiul de a fi parteneri
                  ai unui proces magic, vechi de milioane de ani.”
                </p>
                <cite className="text-text-muted text-sm mt-2 block">— Ion Popescu, fondator Stupul Bio</cite>
              </blockquote>

              <Link href="/contact" className="btn-secondary">
                Ia legătura cu noi
              </Link>
            </motion.div>

            {/* Apiary photo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={heroVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <Image
                src="/images/apiar-stupul-bio.jpg"
                alt="Stupina Stupul Bio — stupii colorați așezați în câmp, cu dealurile împădurite în fundal"
                width={1600}
                height={1200}
                priority
                className="rounded-lg shadow-xl w-full max-w-md h-auto object-cover border border-gold-400/10"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <TimelineSection />

      {/* CTA Banner */}
      <div
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #141008 0%, #241E14 100%)" }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-text-primary mb-3">Vrei să ne vizitezi?</h2>
          <p className="text-text-secondary mb-6">
            Organizăm vizite la stupină pentru grupe mici. Contactează-ne și planificăm împreună.
          </p>
          <Link href="/contact" className="btn-primary">
            Scrie-ne un mesaj
          </Link>
        </div>
      </div>
    </div>
  );
}
