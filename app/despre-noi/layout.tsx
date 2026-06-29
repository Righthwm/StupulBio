import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Despre noi — Stupina Fagurul de Aur din Gorj",
  description:
    "Povestea stupinei Fagurul de Aur: din 2009, peste 120 de familii de albine, miere recoltată manual prin extracție la rece, fără antibiotice. Apicultură pastorală în România.",
  path: "/despre-noi",
  keywords: ["stupină Gorj", "apicultor România", "miere recoltată manual", "apicultură pastorală"],
});

export default function DespreNoiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
