"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Shield } from "lucide-react";

export function AuthNav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Avoid layout shift / hydration mismatch while the session loads.
  if (status === "loading") {
    return <div className="w-9 h-9 shrink-0" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          className="hidden sm:inline-flex font-body text-sm font-medium text-text-secondary hover:text-gold-300 transition-colors px-2"
        >
          Login
        </Link>
        <Link href="/register" className="btn-primary text-xs px-3 py-2 hidden sm:inline-flex">
          Înregistrare
        </Link>
        <Link
          href="/login"
          className="sm:hidden p-2.5 text-text-secondary hover:text-gold-300 transition-colors"
          aria-label="Autentificare"
        >
          <User size={22} />
        </Link>
      </div>
    );
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2.5 text-text-secondary hover:text-gold-300 transition-colors"
        aria-label="Meniu cont"
        aria-expanded={open}
      >
        <User size={22} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card p-2 z-40">
          <div className="px-3 py-2 border-b border-gold-400/10 mb-1">
            <p className="text-text-primary text-sm font-medium truncate">{session.user.name}</p>
            <p className="text-text-muted text-xs truncate">{session.user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-gold-300 hover:bg-gold-400/5 rounded-sm transition-colors"
          >
            <LayoutDashboard size={15} /> Contul meu
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-gold-300 hover:bg-gold-400/5 rounded-sm transition-colors"
            >
              <Shield size={15} /> Panou admin
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-error hover:bg-error/5 rounded-sm transition-colors"
          >
            <LogOut size={15} /> Delogare
          </button>
        </div>
      )}
    </div>
  );
}
