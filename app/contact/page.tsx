"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { HexPattern } from "@/components/ui/HexPattern";
import { HoneyDropLoader } from "@/components/ui/HoneyDropLoader";

const schema = z.object({
  name: z.string().min(2, "Minim 2 caractere"),
  email: z.string().email("Email invalid"),
  phone: z.string().optional(),
  subject: z.enum(["Comandă", "Informații produs", "Parteneriat", "Altele"]),
  message: z.string().min(10, "Mesajul trebuie să aibă minim 10 caractere"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-bg-primary pt-20">
      {/* Header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="gold-line" />
          <h1 className="font-heading text-text-primary">Contact</h1>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto">
            Aveți o întrebare sau o comandă specială? Suntem aici.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-heading text-2xl text-text-primary mb-8">Informații de contact</h2>

            <div className="space-y-5 mb-8">
              {[
                { icon: MapPin, label: "Adresă", value: "Gorj, România" },
                { icon: Mail, label: "Email", value: "faguruldeaur@gmail.com" },
                { icon: Phone, label: "Telefon", value: "+40 743 252 661" },
                { icon: Clock, label: "Program", value: "Lun–Vin: 09:00–18:00" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-sm bg-bg-elevated border border-gold-400/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs uppercase tracking-widest font-body">{label}</p>
                    <p className="text-text-primary text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-10">
              <a href="https://www.facebook.com/profile.php?id=61590509170705" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-gold-300 transition-colors border border-gold-400/20 px-3 py-2 rounded-sm"
                aria-label="Facebook Fagurul de Aur">
                <FacebookIcon /> Facebook
              </a>
              <a href="https://www.instagram.com/faguruldeaur/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-gold-300 transition-colors border border-gold-400/20 px-3 py-2 rounded-sm"
                aria-label="Instagram Fagurul de Aur">
                <InstagramIcon /> Instagram
              </a>
            </div>

            {/* Apiary transport photo */}
            <div className="rounded-sm border border-gold-400/12 overflow-hidden bg-bg-surface">
              <Image
                src="/images/transport-stupi.jpg"
                alt="Camion încărcat cu stupii coloraţi ai stupinei Fagurul de Aur, pregătit pentru transport în pastoral"
                width={1600}
                height={1200}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl text-text-primary mb-8">Trimite un mesaj</h2>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-12 text-center card p-8"
              >
                <CheckCircle size={48} className="text-success" />
                <h3 className="font-heading text-xl text-text-primary">
                  Mesajul a ajuns la noi!
                </h3>
                <p className="text-text-secondary text-sm">Răspundem în 24h în zilele lucrătoare.</p>
                <button onClick={() => setStatus("idle")} className="btn-secondary text-xs px-5 py-2 mt-2">
                  Trimite alt mesaj
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                aria-label="Formular contact"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
                      Nume *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`input-field ${errors.name ? "error" : ""}`}
                      placeholder="Numele tău"
                      aria-describedby={errors.name ? "err-name" : undefined}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p id="err-name" className="text-error text-xs mt-1" role="alert">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={`input-field ${errors.email ? "error" : ""}`}
                      placeholder="email@exemplu.ro"
                      aria-describedby={errors.email ? "err-email" : undefined}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p id="err-email" className="text-error text-xs mt-1" role="alert">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
                    Telefon (opțional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="input-field"
                    placeholder="+40 700 000 000"
                    {...register("phone")}
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
                    Subiect *
                  </label>
                  <select
                    id="contact-subject"
                    className={`input-field ${errors.subject ? "error" : ""}`}
                    aria-describedby={errors.subject ? "err-subject" : undefined}
                    {...register("subject")}
                  >
                    <option value="">Alege subiectul…</option>
                    <option value="Comandă">Comandă</option>
                    <option value="Informații produs">Informații produs</option>
                    <option value="Parteneriat">Parteneriat</option>
                    <option value="Altele">Altele</option>
                  </select>
                  {errors.subject && (
                    <p id="err-subject" className="text-error text-xs mt-1" role="alert">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
                    Mesaj *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className={`input-field resize-none ${errors.message ? "error" : ""}`}
                    placeholder="Scrie mesajul tău aici…"
                    aria-describedby={errors.message ? "err-message" : undefined}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p id="err-message" className="text-error text-xs mt-1" role="alert">{errors.message.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-error text-sm" role="alert">
                    <AlertCircle size={16} />
                    A apărut o eroare. Te rugăm să încerci din nou.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full gap-3"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <HoneyDropLoader size={20} />
                      Se trimite…
                    </>
                  ) : (
                    "Trimite Mesajul"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
