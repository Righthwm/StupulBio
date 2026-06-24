import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { setUserRole } from "./actions";

export const metadata: Metadata = { title: "Admin · Clienți" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-text-primary">Clienți ({users.length})</h1>

      <div className="overflow-x-auto border border-gold-400/10 rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-surface text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left font-medium px-3 py-2">Nume</th>
              <th className="text-left font-medium px-3 py-2">Email</th>
              <th className="text-left font-medium px-3 py-2">Rol</th>
              <th className="text-right font-medium px-3 py-2">Comenzi</th>
              <th className="text-left font-medium px-3 py-2">Înregistrat</th>
              <th className="text-right font-medium px-3 py-2">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = session?.user?.id === u.id;
              const isAdmin = u.role === "ADMIN";
              const nextRole = isAdmin ? "CLIENT" : "ADMIN";
              return (
                <tr key={u.id} className="border-t border-gold-400/8">
                  <td className="px-3 py-2 text-text-primary">{u.name}</td>
                  <td className="px-3 py-2 text-text-secondary">{u.email}</td>
                  <td className="px-3 py-2">
                    <Badge color={isAdmin ? "amber" : "green"}>{isAdmin ? "Admin" : "Client"}</Badge>
                  </td>
                  <td className="px-3 py-2 text-right text-text-muted">{u._count.orders}</td>
                  <td className="px-3 py-2 text-text-muted whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {isSelf ? (
                      <span className="text-text-muted text-xs">(tu)</span>
                    ) : (
                      <form action={setUserRole.bind(null, u.id, nextRole)}>
                        <button
                          type="submit"
                          className="text-xs text-gold-300 hover:text-gold-200 border border-gold-400/30 rounded-sm px-2.5 py-1 transition-colors"
                        >
                          {isAdmin ? "Fă client" : "Fă admin"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
