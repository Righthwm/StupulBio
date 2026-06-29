import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Comandă miere naturală direct de la stupină",
  description:
    "Contactează Fagurul de Aur pentru miere naturală pură, comenzi en-gros sau întrebări despre produsele apicole. Telefon, e-mail și adresa stupinei din Gorj.",
  path: "/contact",
  keywords: ["contact apicultor", "comandă miere", "miere en-gros România"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
