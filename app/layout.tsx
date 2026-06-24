import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { InlineScript } from "@/components/ui/InlineScript";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

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
  title: {
    default: "Stupul Bio — Miere Artizanală Pură, 100% Naturală",
    template: "%s — Stupul Bio",
  },
  description:
    "Cumpără miere naturală de calitate superioară: salcâm, tei, mană, polifloră. Recoltată manual în România. Livrare rapidă în toată țara.",
  keywords: [
    "miere naturală",
    "miere pură",
    "miere de salcâm",
    "miere artizanală",
    "stupul bio",
    "miere românească",
    "produse apicole",
  ],
  authors: [{ name: "Stupul Bio" }],
  openGraph: {
    title: "Stupul Bio — Miere Artizanală Pură, 100% Naturală",
    description:
      "Miere naturală artizanală, recoltată manual în România. Salcâm, tei, mană și mai mult.",
    type: "website",
    locale: "ro_RO",
    siteName: "Stupul Bio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stupul Bio",
    description: "Miere artizanală pură, 100% naturală, din România.",
  },
  robots: {
    index: true,
    follow: true,
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
        <InlineScript html={`(function(){try{if(localStorage.getItem("stupul-bio-theme")==="light")document.documentElement.classList.add("light")}catch(e){}})();`} />
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
