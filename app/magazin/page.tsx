import type { Metadata } from "next";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { HexPattern } from "@/components/ui/HexPattern";

export const metadata: Metadata = {
  title: "Magazin",
  description:
    "Descoperă întreaga gamă de produse Fagurul de Aur: miere de salcâm, tei, munte, mană și propolis.",
};

export default function MagazinPage() {
  return (
    <div className="relative min-h-screen bg-bg-primary pt-20">
      {/* Hero header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="block w-12 h-px bg-gold-400 mx-auto mb-5" aria-hidden="true" />
          <h1 className="font-heading text-text-primary">Magazin</h1>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto">
            Toată mierea și produsele apicole Fagurul de Aur, recoltate manual din România.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid />
      </div>
    </div>
  );
}
