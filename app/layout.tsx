import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { InlineScript } from "@/components/ui/InlineScript";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import {
  siteConfig,
  siteKeywords,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  jsonLd,
} from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Miere Naturală Pură din România | Fagurul de Aur",
    template: "%s — Fagurul de Aur",
  },
  description: siteConfig.description,
  keywords: siteKeywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  category: "Food & Beverage",
  openGraph: {
    title: "Miere Naturală Pură din România | Fagurul de Aur",
    description:
      "Miere naturală pură online, direct de la stupină. Salcâm, tei, munte, polifloră, propolis — miere crudă, extracție la rece, garanție puritate. Livrare 24–48h.",
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Miere naturală Fagurul de Aur — stupina din Gorj, România" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miere Naturală Pură din România | Fagurul de Aur",
    description: "Miere artizanală pură, 100% naturală, recoltată manual în România.",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <InlineScript html={`(function(){try{if(localStorage.getItem("fagurul-de-aur-theme")==="light")document.documentElement.classList.add("light")}catch(e){}})();`} />
        {/* Site-wide structured data: brand, website, physical apiary */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd([organizationSchema(), websiteSchema(), localBusinessSchema()]),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* No server-side session here: keeps public pages statically generated.
            AuthNav fetches the session client-side via useSession. */}
        <SessionProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </SessionProvider>
      </body>
    </html>
  );
}
