import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price} lei`;
}

/** Romanian display labels for order statuses (stored as plain strings). */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  noua: "Nouă",
  in_procesare: "În procesare",
  expediat: "Expediat",
  livrat: "Livrat",
  anulata: "Anulată",
};

/** Romanian display labels for the online payment status. */
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  "n/a": "Ramburs",
  pending: "În așteptare",
  paid: "Plătită",
  failed: "Eșuată",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getVariantLabel(variant: { weight?: string; type?: string; price: number }): string {
  const label = variant.weight ?? variant.type ?? "";
  return `${label} · ${variant.price} lei`;
}
