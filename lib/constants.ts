// Plain constants shared by both client (cart) and server (shipping) code.
// Kept free of "use client" and heavy imports so it's safe to import anywhere.

/** Flat shipping fee (lei) used as a pre-estimate fallback. */
export const SHIPPING_COST = 30;

/** Order subtotal (lei) at or above which shipping is free. */
export const FREE_SHIPPING_THRESHOLD = 250;

/** Discount code offered for newsletter / exit-popup signups. */
export const NEWSLETTER_DISCOUNT_CODE = "FAGURE10";
