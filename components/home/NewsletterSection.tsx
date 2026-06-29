"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { HexPattern } from "@/components/ui/HexPattern";
import { NEWSLETTER_DISCOUNT_CODE } from "@/lib/constants";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Te rugăm să introduci un email valid.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("Ceva n-a mers. Te rugăm încearcă din nou.");
    }
  };

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary overflow-hidden"
      aria-label="Newsletter"
    >
      <HexPattern opacity={0.03} />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="text-gold-400 mx-auto mb-4" size={32} aria-hidden="true" />
          <h2 className="font-heading text-text-primary mb-3">
            Primește <span className="text-gold-300">10%</span> la prima comandă
          </h2>
          <p className="text-text-secondary mb-8 text-base">
            Plus rețete cu miere, povești din stupină și acces la recoltele limitate, înaintea tuturor.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <CheckCircle size={40} className="text-success" />
              <p className="text-text-primary font-heading text-xl">Mulțumim pentru abonare!</p>
              <p className="text-text-muted text-sm">
                Codul tău de 10%:{" "}
                <strong className="text-gold-300 tracking-wider">{NEWSLETTER_DISCOUNT_CODE}</strong>
              </p>
              <p className="text-text-muted text-xs">Ți l-am trimis și pe email. Folosește-l la prima comandă.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              aria-label="Formular newsletter"
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Adresa de email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adresa@email.ro"
                  className={`input-field ${error ? "error" : ""}`}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  required
                />
                {error && (
                  <p id="newsletter-error" className="text-error text-xs mt-1 text-left">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary shrink-0"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="inline-block w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Trimite-mi codul"
                )}
              </button>
            </form>
          )}

          <p className="text-text-muted text-xs mt-4">
            Fără spam. Un email pe lună, te dezabonezi oricând.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
