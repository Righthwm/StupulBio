"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, CheckCircle } from "lucide-react";
import { NEWSLETTER_DISCOUNT_CODE } from "@/lib/constants";

const SEEN_KEY = "fda-exit-popup-seen";

/**
 * Exit-intent recovery popup: fires once (per ~14 days) when the cursor leaves
 * toward the top of the viewport, offering the 10% first-order discount.
 */
export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const seen = Number(localStorage.getItem(SEEN_KEY) ?? 0);
      if (Date.now() - seen < 14 * 24 * 60 * 60 * 1000) return; // shown recently
    } catch {
      /* localStorage unavailable */
    }

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) {
        setOpen(true);
        try {
          localStorage.setItem(SEEN_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
        document.removeEventListener("mouseout", onLeave);
      }
    };

    // Give the visitor a moment before arming the trigger.
    const t = setTimeout(() => document.addEventListener("mouseout", onLeave), 4000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true); // optimistic — the lead send happens in the background
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
    } catch {
      /* lead send failed; the user still sees their code */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ofertă reducere 10%"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md card p-8 text-center"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Închide"
              className="absolute top-3 right-3 p-1.5 text-text-muted hover:text-gold-300 transition-colors"
            >
              <X size={18} />
            </button>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle size={40} className="text-success" />
                <p className="font-heading text-xl text-text-primary">Gata, e al tău!</p>
                <p className="text-text-secondary text-sm">
                  Codul tău de 10%:{" "}
                  <strong className="text-gold-300 tracking-wider">{NEWSLETTER_DISCOUNT_CODE}</strong>
                </p>
                <p className="text-text-muted text-xs">Ți l-am trimis și pe email.</p>
              </div>
            ) : (
              <>
                <Gift size={36} className="text-gold-400 mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-heading text-2xl text-text-primary mb-2">
                  Stai puțin — 10% sunt ai tăi
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                  Înainte să pleci, ia-ți reducerea la prima comandă de miere pură din Gorj.
                </p>
                <form onSubmit={submit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adresa@email.ro"
                    className="input-field"
                    aria-label="Adresa de email"
                    required
                  />
                  <button type="submit" className="btn-primary w-full">
                    Vreau reducerea de 10%
                  </button>
                </form>
                <p className="text-text-muted text-xs mt-4">
                  Doar codul, fără spam. Te dezabonezi cu un click.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
