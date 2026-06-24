import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const links = [
    { href: "/admin", label: "Trafic" },
    { href: "/admin/comenzi", label: "Comenzi" },
    { href: "/admin/mesaje", label: "Mesaje" },
    { href: "/admin/clienti", label: "Clienți" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-48 shrink-0">
          <span className="font-heading text-xl text-gold-300 block mb-4">Panou admin</span>
          <nav className="flex md:flex-col gap-1 text-sm border-b md:border-b-0 border-gold-400/10 pb-2 md:pb-0">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-sm text-text-secondary hover:text-gold-300 hover:bg-gold-400/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
