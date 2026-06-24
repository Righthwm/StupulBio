"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBasket, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthNav } from "./AuthNav";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/lib/cart";
import { useScrollY } from "@/hooks/useParallax";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/magazin", label: "Magazin" },
  { href: "/despre-noi", label: "Despre Noi" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Cart is persisted in localStorage; render 0 until mounted so the SSR
  // markup matches the first client render.
  const [mounted, setMounted] = useState(false);
  const { totalItems, openCart } = useCartStore();
  const scrollY = useScrollY();
  const scrolled = scrollY > 80 || mobileOpen;
  const count = mounted ? totalItems() : 0;

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-30 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md border-b border-gold-400/15"
            : "border-b border-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--nav-scrim)" : "transparent",
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20"
          role="navigation"
          aria-label="Navigare principală"
        >
          <Logo size="sm" />

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm font-medium tracking-wide text-text-secondary hover:text-gold-300 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Auth (login / register / account menu) */}
            <AuthNav />

            {/* Cart button */}
            <motion.button
              onClick={openCart}
              className="relative p-2.5 text-text-secondary hover:text-gold-300 transition-colors"
              aria-label={`Coș de cumpărături — ${count} ${count === 1 ? "produs" : "produse"}`}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBasket size={22} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-gold-400 text-bg-primary text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px]"
                >
                  {count}
                </motion.span>
              )}
            </motion.button>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 text-text-secondary hover:text-gold-300 transition-colors"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
