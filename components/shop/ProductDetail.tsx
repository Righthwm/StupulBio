"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, ShoppingBasket, MapPin, Leaf, Truck, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { useCartStore } from "@/lib/cart";
import { formatPrice, getVariantLabel } from "@/lib/utils";
import { getRelatedProducts, reviews as allReviews } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

function ReviewItem({ author, city, rating, text, date }: { author: string; city: string; rating: number; text: string; date: string }) {
  return (
    <li className="py-5 border-b border-gold-400/8">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-sm bg-gold-400 flex items-center justify-center shrink-0 hex-clip">
          <span className="text-[#14100A] text-xs font-bold font-body">
            {author.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-text-primary text-sm font-semibold">{author}</span>
            <span className="text-text-muted text-xs">· {city}</span>
            <span className="text-text-muted text-xs ml-auto">{new Date(date).toLocaleDateString("ro-RO")}</span>
          </div>
          <div className="flex gap-0.5 mt-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} className={i < rating ? "text-gold-300 fill-current" : "text-text-muted"} />
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </li>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("descriere");
  const [addedAnim, setAddedAnim] = useState(false);
  const { addItem, openCart } = useCartStore();

  const productReviews = allReviews[product.slug] ?? [];
  const related = getRelatedProducts(product);

  const handleAdd = () => {
    addItem(product, selectedVariant, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
    openCart();
  };

  const tabs = [
    { id: "descriere", label: "Descriere" },
    { id: "beneficii", label: "Beneficii" },
    { id: "detalii", label: "Detalii recoltare" },
    { id: "recenzii", label: `Recenzii (${productReviews.length})` },
  ];

  return (
    <div>
      {/* Product main section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Image */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-full rounded-sm border border-gold-400/10 bg-bg-surface flex items-center justify-center p-8"
            style={{ minHeight: "360px" }}
          >
            <ProductVisual product={product} width={250} className="mx-auto" />
          </div>
        </div>

        {/* Details */}
        <div>
          {product.badge && (
            <Badge color={product.badgeColor ?? "gold"} className="mb-3">
              {product.badge}
            </Badge>
          )}

          <h1 className="font-heading text-text-primary mb-3">{product.name}</h1>

          {/* Rating */}
          <a href="#recenzii" className="flex items-center gap-2 mb-5 w-fit" onClick={() => setActiveTab("recenzii")}>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-gold-300 fill-current" : "text-text-muted"} />
              ))}
            </div>
            <span className="text-gold-300 text-sm font-semibold">{product.rating}</span>
            <span className="text-text-muted text-sm">({product.reviewCount} recenzii)</span>
          </a>

          <p className="text-text-secondary leading-relaxed mb-6">{product.description}</p>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-text-muted text-xs uppercase tracking-widest font-body mb-2">
                Gramaj
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.price}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm border rounded-sm transition-all font-body ${
                      selectedVariant.price === v.price
                        ? "border-gold-400 bg-gold-400/10 text-gold-300"
                        : "border-gold-400/20 text-text-muted hover:border-gold-400/50"
                    }`}
                    aria-pressed={selectedVariant.price === v.price}
                  >
                    {getVariantLabel(v)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-heading text-gold-300 text-4xl">{formatPrice(selectedVariant.price)}</span>
            <span className="text-text-muted text-sm">/ {selectedVariant.weight ?? selectedVariant.type}</span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center border border-gold-400/20 rounded-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-11 flex items-center justify-center text-text-muted hover:text-gold-300 transition-colors"
                aria-label="Scade cantitate"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-text-primary font-body">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-11 flex items-center justify-center text-text-muted hover:text-gold-300 transition-colors"
                aria-label="Crește cantitate"
              >
                <Plus size={14} />
              </button>
            </div>

            <motion.button
              onClick={handleAdd}
              animate={addedAnim ? { x: [0, -4, 4, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="btn-primary flex-1 gap-2"
            >
              {addedAnim ? (
                <>
                  <Check size={16} />
                  Adăugat!
                </>
              ) : (
                <>
                  <ShoppingBasket size={16} />
                  Adaugă în coș
                </>
              )}
            </motion.button>
          </div>

          {/* Benefits strip */}
          <div className="flex flex-wrap gap-4 py-4 border-t border-b border-gold-400/8">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin size={13} className="text-gold-400" />
              {product.origin}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Leaf size={13} className="text-gold-400" />
              100% Naturală
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Truck size={13} className="text-gold-400" />
              Livrare 24–48h
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12" id="recenzii">
        <div className="flex gap-0 border-b border-gold-400/12 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-body font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? "border-gold-400 text-gold-300"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "descriere" && (
              <div className="prose prose-invert max-w-3xl">
                {product.longDescription.split("\n\n").map((block, i) =>
                  block.startsWith("## ") ? (
                    <h2 key={i} className="font-heading text-text-primary text-xl mt-7 mb-2 first:mt-0">
                      {block.slice(3)}
                    </h2>
                  ) : (
                    <p key={i} className="text-text-secondary leading-relaxed mb-4">{block}</p>
                  )
                )}
              </div>
            )}

            {activeTab === "beneficii" && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-text-secondary">
                    <Check size={14} className="text-gold-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "detalii" && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {[
                  { label: "Origine", value: product.origin },
                  { label: "Recoltă", value: product.harvest },
                  { label: "Gramaj de bază", value: product.priceUnit },
                  { label: "Categorie", value: product.category === "miere" ? "Miere" : "Produse apicole" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-gold-400/8 pb-3">
                    <dt className="text-text-muted text-xs uppercase tracking-wider mb-1">{label}</dt>
                    <dd className="text-text-primary text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === "recenzii" && (
              <div id="recenzii-section">
                {productReviews.length > 0 ? (
                  <ul>
                    {productReviews.map((r) => (
                      <ReviewItem key={r.id} {...r} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-muted">Nu există recenzii încă pentru acest produs.</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl text-text-primary mb-6">Îți poate plăcea și…</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
