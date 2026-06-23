import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      <aside className="w-56 shrink-0 border-r border-gold-400/10 p-6 flex flex-col gap-6">
        <Link href="/admin" className="font-heading text-xl text-gold-300">
          Stupul Bio
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin/comenzi" className="hover:text-gold-300 transition-colors">
            Comenzi
          </Link>
          <Link href="/admin/mesaje" className="hover:text-gold-300 transition-colors">
            Mesaje
          </Link>
        </nav>
        <form action={logout} className="mt-auto">
          <button type="submit" className="text-text-muted text-sm hover:text-error transition-colors">
            Delogare
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
