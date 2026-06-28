import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HexPattern } from "@/components/ui/HexPattern";
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/magazin", label: "Magazin" },
  { href: "/despre-noi", label: "Despre Noi" },
  { href: "/contact", label: "Contact" },
];

const productLinks = [
  { href: "/magazin/miere-salcam", label: "Miere Salcâm" },
  { href: "/magazin/miere-tei", label: "Miere Tei" },
  { href: "/magazin/miere-munte", label: "Miere de Munte" },
  { href: "/magazin/tinctura-propolis", label: "Tinctură Propolis" },
];

const legalLinks = [
  { href: "/gdpr", label: "Politică GDPR" },
  { href: "/termeni", label: "Termeni & Condiții" },
];

export function Footer() {
  return (
    <footer
      className="relative bg-bg-secondary border-t border-gold-400/10 overflow-hidden"
      aria-label="Footer"
    >
      <HexPattern opacity={0.025} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Miere artizanală pură, 100% naturală. Recoltată cu pasiune, livrată cu grijă.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61590509170705"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-sm border border-gold-400/20 text-text-muted hover:text-gold-300 hover:border-gold-400/50 transition-all"
                aria-label="Fagurul de Aur pe Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/faguruldeaur/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-sm border border-gold-400/20 text-text-muted hover:text-gold-300 hover:border-gold-400/50 transition-all"
                aria-label="Fagurul de Aur pe Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Navigare
            </h3>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Produse
            </h3>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-400/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Fagurul de Aur · Gorj, România · Toate drepturile rezervate
          </p>
          <p className="text-text-muted text-xs">
            <span className="text-gradient-gold">Miere pură</span> · Livrare în toată România
          </p>
        </div>
      </div>
    </footer>
  );
}
