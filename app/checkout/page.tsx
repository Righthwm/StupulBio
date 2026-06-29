"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  Lock,
  CheckCircle,
  ShoppingBasket,
  AlertCircle,
} from "lucide-react";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { couponDiscount } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import { HexPattern } from "@/components/ui/HexPattern";
import { HoneyDropLoader } from "@/components/ui/HoneyDropLoader";
import { PaymentBadges } from "@/components/ui/PaymentBadges";

const counties = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov",
  "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța",
  "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara",
  "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt",
  "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea",
  "Vaslui", "Vâlcea", "Vrancea",
];

const schema = z
  .object({
    firstName: z.string().min(2, "Minim 2 caractere"),
    lastName: z.string().min(2, "Minim 2 caractere"),
    email: z.string().email("Email invalid"),
    phone: z
      .string()
      .transform((v) => v.replace(/[\s.-]/g, ""))
      .pipe(z.string().regex(/^(\+40|0)?7\d{8}$/, "Telefon invalid (ex: 07XX XXX XXX)")),
    county: z.string().min(1, "Alege județul"),
    localityType: z.enum(["urban", "rural"]),
    city: z.string().min(1, "Alege localitatea"),
    address: z.string().min(5, "Strada, numărul, bloc/apartament"),
    postalCode: z.string().regex(/^\d{6}$/, "Cod poștal din 6 cifre"),
    paymentMethod: z.enum(["card", "ramburs"]),
    notes: z.string().optional(),
    terms: z.boolean().refine((v) => v === true, "Trebuie să accepți termenii și condițiile"),
  });

type FormData = z.infer<typeof schema>;

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-xs text-text-muted uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-error text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPayment, setOrderPayment] = useState<"card" | "ramburs">("ramburs");
  // Card payment is only available once Netopia is configured (server tells us).
  const [cardEnabled, setCardEnabled] = useState(false);
  // Discount coupon (validated again server-side on submit).
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/payment/config")
      .then((r) => r.json())
      .then((d: { cardEnabled: boolean }) => setCardEnabled(!!d.cardEnabled))
      .catch(() => setCardEnabled(false));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "ramburs", terms: false, localityType: "urban" },
  });

  const paymentMethod = watch("paymentMethod");
  const county = watch("county");
  const locality = watch("city");
  const localityType = watch("localityType");

  // Gate cart-derived values on `mounted`: the cart is rehydrated from
  // localStorage on the client, so reading it during SSR / first render would
  // mismatch. Until mounted, render the same neutral values the server does.
  const subtotal = mounted ? totalPrice() : 0;
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  // ---- Fan Courier shipping estimate ----
  type Estimate =
    | { status: "idle" | "loading" | "free" | "unavailable" }
    | { status: "available"; cost: number };
  const [localities, setLocalities] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<Estimate>({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable signature of the cart so the estimate effect re-runs on cart changes.
  const itemsSig = items
    .map((i) => `${i.product.id}:${i.selectedVariant.price}x${i.quantity}`)
    .join(",");

  // County → load its localities, reset the chosen locality.
  useEffect(() => {
    setValue("city", "");
    if (!county) {
      setLocalities([]);
      return;
    }
    let active = true;
    fetch(`/api/shipping/localities?county=${encodeURIComponent(county)}`)
      .then((r) => r.json())
      .then((d: { localities: string[] }) => {
        if (active) setLocalities(d.localities ?? []);
      })
      .catch(() => active && setLocalities([]));
    return () => {
      active = false;
    };
  }, [county, setValue]);

  // Address + cart → debounced shipping estimate. Free shipping short-circuits.
  useEffect(() => {
    if (!mounted || items.length === 0) return;
    if (freeShipping) {
      setEstimate({ status: "free" });
      return;
    }
    if (!county || !locality || !localityType) {
      setEstimate({ status: "idle" });
      return;
    }
    setEstimate({ status: "loading" });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          county,
          locality,
          localityType,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.product.id,
            variantPrice: i.selectedVariant.price,
            quantity: i.quantity,
          })),
        }),
      })
        .then((r) => r.json())
        .then((d: { free: boolean; available: boolean; cost: number | null }) => {
          if (d.free) setEstimate({ status: "free" });
          else if (d.available && typeof d.cost === "number") setEstimate({ status: "available", cost: d.cost });
          else setEstimate({ status: "unavailable" });
        })
        .catch(() => setEstimate({ status: "unavailable" }));
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, county, locality, localityType, paymentMethod, freeShipping, itemsSig]);

  const shippingCost = estimate.status === "available" ? estimate.cost : 0;
  const discount = couponDiscount(subtotal, appliedCoupon);
  const total = Math.max(0, subtotal + shippingCost - discount);

  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const json: { valid: boolean; code?: string; message?: string } = await res.json();
      if (!json.valid || !json.code) {
        setAppliedCoupon(null);
        setCouponError(json.message ?? "Cod invalid.");
        return;
      }
      setAppliedCoupon(json.code);
      setCouponInput(json.code);
    } catch {
      setCouponError("Nu am putut valida codul. Încearcă din nou.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    const payload = {
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      shippingAddress: {
        county: data.county,
        city: data.city,
        localityType: data.localityType,
        address: data.address,
        postalCode: data.postalCode,
      },
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      couponCode: appliedCoupon ?? undefined,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        variant: i.selectedVariant.weight ?? i.selectedVariant.type,
        unitPrice: i.selectedVariant.price,
        quantity: i.quantity,
      })),
    };

    try {
      if (data.paymentMethod === "card") {
        // Create a pending order + start Netopia, then go to the hosted card page.
        const res = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json: { redirectUrl?: string } = await res.json();
        if (!res.ok || !json.redirectUrl) throw new Error("failed");
        window.location.href = json.redirectUrl; // browser navigates to Netopia
        return;
      }

      // Ramburs: persist + confirm inline.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const json: { orderId: string; totals?: { total: number } } = await res.json();
      setOrderTotal(json.totals?.total ?? total);
      setOrderPayment(data.paymentMethod);
      setOrderId(json.orderId);
      clearCart();
      setStatus("idle");
      window.scrollTo({ top: 0 });
    } catch {
      setStatus("error");
    }
  };

  /* ---- Success screen ---- */
  if (orderId) {
    return (
      <div className="bg-bg-primary pt-20 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-10">
            <CheckCircle size={56} className="text-success mx-auto mb-5" />
            <h1 className="font-heading text-3xl text-text-primary mb-3" style={{ fontSize: "2rem" }}>
              Comanda a fost plasată!
            </h1>
            <p className="text-text-secondary mb-6">
              Mulțumim! Vei primi un email de confirmare în câteva minute.
            </p>
            <div className="bg-bg-elevated border border-gold-400/15 rounded-sm p-5 text-left space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Număr comandă</span>
                <span className="text-gold-300 font-semibold font-body">{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total</span>
                <span className="text-text-primary font-semibold">{formatPrice(orderTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Plată</span>
                <span className="text-text-primary">
                  {orderPayment === "card" ? "Card bancar (plătită)" : "Ramburs la livrare"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Livrare estimată</span>
                <span className="text-text-primary">24–48h lucrătoare</span>
              </div>
            </div>
            <Link href="/magazin" className="btn-primary">
              Înapoi la magazin
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ---- Empty cart ---- */
  if (mounted && items.length === 0) {
    return (
      <div className="bg-bg-primary pt-20 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <ShoppingBasket size={56} className="text-text-muted opacity-30 mx-auto mb-5" />
          <h1 className="font-heading text-text-primary mb-3" style={{ fontSize: "2rem" }}>
            Coșul tău este gol
          </h1>
          <p className="text-text-secondary mb-8">
            Adaugă produse în coș pentru a finaliza o comandă.
          </p>
          <Link href="/magazin" className="btn-primary">
            Descoperă produsele
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary pt-20 min-h-screen">
      {/* Header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="gold-line" />
          <h1 className="font-heading text-text-primary" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Finalizare Comandă
          </h1>
          <div className="flex items-center justify-center gap-5 mt-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><Lock size={13} className="text-gold-400" /> Plată securizată</span>
            <span className="flex items-center gap-1.5"><Truck size={13} className="text-gold-400" /> Livrare 24–48h</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold-400" /> Retur 14 zile</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ---- Left: form ---- */}
          <div className="lg:col-span-3 space-y-10">
            {/* Contact */}
            <section aria-label="Date de contact">
              <h2 className="font-heading text-xl text-text-primary mb-5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gold-400 text-bg-primary text-sm font-body font-bold flex items-center justify-center">1</span>
                Date de contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Prenume *" htmlFor="firstName" error={errors.firstName?.message}>
                  <input id="firstName" type="text" autoComplete="given-name" placeholder="Ion"
                    className={`input-field ${errors.firstName ? "error" : ""}`} {...register("firstName")} />
                </Field>
                <Field label="Nume *" htmlFor="lastName" error={errors.lastName?.message}>
                  <input id="lastName" type="text" autoComplete="family-name" placeholder="Popescu"
                    className={`input-field ${errors.lastName ? "error" : ""}`} {...register("lastName")} />
                </Field>
                <Field label="Email *" htmlFor="email" error={errors.email?.message}>
                  <input id="email" type="email" autoComplete="email" placeholder="email@exemplu.ro"
                    className={`input-field ${errors.email ? "error" : ""}`} {...register("email")} />
                </Field>
                <Field label="Telefon *" htmlFor="phone" error={errors.phone?.message}>
                  <input id="phone" type="tel" autoComplete="tel" placeholder="07XX XXX XXX"
                    className={`input-field ${errors.phone ? "error" : ""}`} {...register("phone")} />
                </Field>
              </div>
            </section>

            {/* Address */}
            <section aria-label="Adresa de livrare">
              <h2 className="font-heading text-xl text-text-primary mb-5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gold-400 text-bg-primary text-sm font-body font-bold flex items-center justify-center">2</span>
                Adresa de livrare
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Județ *" htmlFor="county" error={errors.county?.message}>
                  <select id="county" autoComplete="address-level1"
                    className={`input-field ${errors.county ? "error" : ""}`} {...register("county")}>
                    <option value="">Alege județul…</option>
                    {counties.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Localitate *" htmlFor="city" error={errors.city?.message}>
                  <select id="city" autoComplete="address-level2" disabled={!county || localities.length === 0}
                    className={`input-field ${errors.city ? "error" : ""}`} {...register("city")}>
                    <option value="">{county ? "Alege localitatea…" : "Alege întâi județul"}</option>
                    {localities.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tip localitate *" htmlFor="localityType" error={errors.localityType?.message}>
                  <select id="localityType" className={`input-field ${errors.localityType ? "error" : ""}`} {...register("localityType")}>
                    <option value="urban">Urban (oraș / municipiu)</option>
                    <option value="rural">Rural (comună / sat)</option>
                  </select>
                </Field>
                <Field label="Cod poștal *" htmlFor="postalCode" error={errors.postalCode?.message}>
                  <input id="postalCode" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="400001"
                    className={`input-field ${errors.postalCode ? "error" : ""}`} {...register("postalCode")} />
                </Field>
                <Field label="Adresă completă *" htmlFor="address" error={errors.address?.message} className="sm:col-span-2">
                  <input id="address" type="text" autoComplete="street-address"
                    placeholder="Str. Florilor nr. 12, bl. A2, sc. 1, ap. 5"
                    className={`input-field ${errors.address ? "error" : ""}`} {...register("address")} />
                </Field>
              </div>
            </section>

            {/* Payment */}
            <section aria-label="Metoda de plată">
              <h2 className="font-heading text-xl text-text-primary mb-5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gold-400 text-bg-primary text-sm font-body font-bold flex items-center justify-center">3</span>
                Metoda de plată
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5" role="radiogroup" aria-label="Alege metoda de plată">
                <label
                  className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                    paymentMethod === "ramburs"
                      ? "border-gold-400 bg-gold-400/8"
                      : "border-gold-400/20 hover:border-gold-400/40"
                  }`}
                >
                  <input type="radio" value="ramburs" className="sr-only" {...register("paymentMethod")} />
                  <Banknote size={20} className={paymentMethod === "ramburs" ? "text-gold-300 mt-0.5" : "text-text-muted mt-0.5"} />
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">Ramburs la livrare</span>
                    <span className="block text-xs text-text-muted mt-0.5">
                      Plătești curierului la primire
                    </span>
                  </span>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border rounded-sm transition-all ${
                    !cardEnabled
                      ? "border-gold-400/15 opacity-50 cursor-not-allowed"
                      : paymentMethod === "card"
                        ? "border-gold-400 bg-gold-400/8 cursor-pointer"
                        : "border-gold-400/20 hover:border-gold-400/40 cursor-pointer"
                  }`}
                >
                  <input type="radio" value="card" disabled={!cardEnabled} className="sr-only" {...register("paymentMethod")} />
                  <CreditCard size={20} className={paymentMethod === "card" && cardEnabled ? "text-gold-300 mt-0.5" : "text-text-muted mt-0.5"} />
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">Card bancar (Netopia)</span>
                    <span className="block text-xs text-text-muted mt-0.5">
                      {cardEnabled
                        ? "Redirecționare către pagina securizată Netopia (3D Secure)"
                        : "Disponibilă în curând"}
                    </span>
                  </span>
                </label>
              </div>

              {paymentMethod === "card" && cardEnabled && (
                <div className="bg-bg-surface border border-gold-400/15 rounded-sm p-4 flex items-start gap-2 text-xs text-text-muted">
                  <Lock size={14} className="text-gold-400 shrink-0 mt-0.5" />
                  După „Plătește”, vei fi redirecționat către pagina securizată Netopia pentru a
                  introduce datele cardului (3D Secure). Nu stocăm datele cardului.
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <PaymentBadges />
                <span className="text-xs text-text-muted">Plată securizată prin NETOPIA Payments</span>
              </div>
            </section>

            {/* Notes */}
            <section aria-label="Observații">
              <Field label="Observații comandă (opțional)" htmlFor="notes">
                <textarea id="notes" rows={3} placeholder="Instrucțiuni pentru livrare, interfon, etc."
                  className="input-field resize-none" {...register("notes")} />
              </Field>
            </section>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group" htmlFor="terms">
                <input id="terms" type="checkbox" className="sr-only" {...register("terms")} />
                <span
                  className={`w-4 h-4 mt-0.5 border rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                    watch("terms")
                      ? "bg-gold-400 border-gold-400"
                      : errors.terms
                        ? "border-error"
                        : "border-gold-400/30 group-hover:border-gold-400/60"
                  }`}
                  aria-hidden="true"
                >
                  {watch("terms") && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="#0D0A06" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-text-muted">
                  Am citit și sunt de acord cu{" "}
                  <Link href="/termeni" className="text-gold-300 hover:underline">Termenii & Condițiile</Link>{" "}
                  și{" "}
                  <Link href="/gdpr" className="text-gold-300 hover:underline">Politica GDPR</Link>. *
                </span>
              </label>
              {errors.terms && (
                <p className="text-error text-xs mt-1.5 ml-7" role="alert">{errors.terms.message}</p>
              )}
            </div>
          </div>

          {/* ---- Right: order summary ---- */}
          <aside className="lg:col-span-2" aria-label="Sumar comandă">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 className="font-heading text-xl text-text-primary mb-5">Sumar comandă</h2>

              {mounted && (
                <ul className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const variantLabel = item.selectedVariant.weight ?? item.selectedVariant.type ?? "";
                    return (
                      <li key={`${item.product.id}-${item.selectedVariant.price}`} className="flex items-center gap-3 pb-3 border-b border-gold-400/8">
                        <div
                          className="w-10 h-10 rounded-sm shrink-0"
                          style={{ background: `radial-gradient(circle at 35% 35%, ${item.product.color}CC, ${item.product.color}55)` }}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm truncate">{item.product.name}</p>
                          <p className="text-text-muted text-xs">{variantLabel} × {item.quantity}</p>
                        </div>
                        <span className="text-gold-300 text-sm font-semibold shrink-0">
                          {formatPrice(item.selectedVariant.price * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <dl className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Subtotal</dt>
                  <dd className="text-text-primary">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Livrare (Fan Courier)</dt>
                  <dd>
                    {freeShipping ? (
                      <span className="text-success">Gratuită</span>
                    ) : estimate.status === "available" ? (
                      <span className="text-text-primary">{formatPrice(estimate.cost)}</span>
                    ) : estimate.status === "loading" ? (
                      <span className="text-text-muted">Se calculează…</span>
                    ) : estimate.status === "unavailable" ? (
                      <span className="text-text-primary">Se calculează la livrare</span>
                    ) : (
                      <span className="text-text-muted">Completează adresa</span>
                    )}
                  </dd>
                </div>
                {!freeShipping && (
                  <p className="text-xs text-text-muted pt-1">
                    Livrare gratuită la comenzi peste {FREE_SHIPPING_THRESHOLD} lei.
                  </p>
                )}
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Reducere ({appliedCoupon})</dt>
                    <dd className="text-success">−{formatPrice(discount)}</dd>
                  </div>
                )}
              </dl>

              {/* Coupon */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-sm bg-bg-elevated border border-gold-400/20 rounded-sm px-3 py-2">
                    <span className="text-success">
                      Cod <strong>{appliedCoupon}</strong> aplicat
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-text-muted hover:text-gold-300 text-xs"
                    >
                      Elimină
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Cod reducere"
                      className="input-field flex-1 uppercase placeholder:normal-case"
                      aria-label="Cod reducere"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="btn-secondary shrink-0 text-sm px-4"
                    >
                      {couponLoading ? "Se verifică…" : "Aplică"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-error text-xs mt-1">{couponError}</p>}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-gold-400/15 mb-6">
                <span className="text-text-secondary font-body text-sm uppercase tracking-wider">Total</span>
                <span className="font-heading text-2xl text-gold-300">{formatPrice(total)}</span>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-error text-sm mb-4" role="alert">
                  <AlertCircle size={15} />
                  A apărut o eroare. Te rugăm să încerci din nou.
                </div>
              )}

              <button type="submit" className="btn-primary w-full gap-3" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <HoneyDropLoader size={20} />
                    Se procesează…
                  </>
                ) : paymentMethod === "card" ? (
                  <>
                    <Lock size={15} />
                    Plătește {formatPrice(total)}
                  </>
                ) : (
                  <>
                    <Truck size={15} />
                    Plasează comanda
                  </>
                )}
              </button>

              <p className="text-text-muted text-xs text-center mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-gold-400" />
                Garanție puritate 100% sau banii înapoi
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
