"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";
import { products } from "@/lib/products";

// Re-exported from the framework-neutral constants module (this file is
// "use client"; server code must read the threshold from lib/constants).
export { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

import { SHIPPING_COST as FLAT, FREE_SHIPPING_THRESHOLD as THRESHOLD } from "@/lib/constants";

/** Shipping fee for a given subtotal — 0 when it qualifies for free shipping. */
export function shippingFor(subtotal: number): number {
  return subtotal >= THRESHOLD ? 0 : FLAT;
}

/**
 * Reconcile a persisted cart against the current catalog so it always reflects
 * what the sales pages show (e.g. honey jars at 1kg). Persisted items hold a
 * frozen snapshot of the product/variant from the moment they were added, which
 * goes stale when product data changes — this refreshes that snapshot.
 */
function reconcileItems(items: CartItem[]): CartItem[] {
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.product.id);
    if (!product) return []; // product no longer exists — drop it

    const saved = item.selectedVariant;
    const variant =
      product.variants.find(
        (v) =>
          (saved.weight != null && v.weight === saved.weight) ||
          (saved.type != null && v.type === saved.type)
      ) ?? product.variants[0];

    return [{ ...item, product, selectedVariant: variant }];
  });
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantPrice: number) => void;
  updateQuantity: (productId: string, variantPrice: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.selectedVariant.price === variant.price
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.selectedVariant.price === variant.price
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity, selectedVariant: variant }],
          };
        });
      },

      removeItem: (productId, variantPrice) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.selectedVariant.price === variantPrice)
          ),
        }));
      },

      updateQuantity: (productId, variantPrice, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantPrice);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.selectedVariant.price === variantPrice
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.selectedVariant.price * i.quantity, 0),
    }),
    {
      name: "stupul-bio-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.items = reconcileItems(state.items);
      },
    }
  )
);
