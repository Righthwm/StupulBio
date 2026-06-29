"use client";

import Image from "next/image";
import { HoneyJar } from "./HoneyJar";
import { TinctureBottle } from "./TinctureBottle";
import type { Product } from "@/types";

interface ProductVisualProps {
  product: Product;
  width?: number;
  className?: string;
}

// The generated jar SVG uses a 240×320 viewBox, so its rendered height is
// width × 4/3. We match a real photo to that height so cards in a grid keep
// their rows aligned regardless of the photo's own aspect ratio.
const JAR_RATIO = 320 / 240;
const PHOTO_RATIO = 1140 / 760; // shared canvas ratio of all normalized product photos

/** Product illustration — real photo when available, else the generated jar/bottle. */
export function ProductVisual({ product, width = 110, className }: ProductVisualProps) {
  if (product.image) {
    const renderHeight = Math.round(width * JAR_RATIO);
    const renderWidth = Math.round(renderHeight / PHOTO_RATIO);
    return (
      <Image
        src={product.image}
        alt={`${product.name} naturală, recoltată manual — Fagurul de Aur`}
        width={renderWidth}
        height={renderHeight}
        sizes={`${renderWidth}px`}
        className={`object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.4)] ${className ?? ""}`}
      />
    );
  }
  if (product.visual === "bottle") {
    return <TinctureBottle color={product.color} width={width} className={className} />;
  }
  return <HoneyJar color={product.color} width={width} className={className} />;
}
