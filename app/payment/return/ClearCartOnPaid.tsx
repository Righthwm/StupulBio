"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart";

/** Empties the cart once a card payment has succeeded. */
export function ClearCartOnPaid() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
