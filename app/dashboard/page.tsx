import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Contul meu" };

interface OrderLine {
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <h1 className="font-heading text-3xl text-text-primary">Bună, {user?.name}!</h1>
        <Badge color={isAdmin ? "amber" : "green"}>{isAdmin ? "Administrator" : "Client"}</Badge>
      </div>

      {/* Profile */}
      <Card className="mb-10">
        <h2 className="font-heading text-lg text-text-primary mb-4">Profilul tău</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wider mb-1">Email</dt>
            <dd className="text-text-primary">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wider mb-1">Membru din</dt>
            <dd className="text-text-primary">
              {user ? new Date(user.createdAt).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Order history */}
      <h2 className="font-heading text-xl text-text-primary mb-4">Comenzile mele</h2>
      {orders.length === 0 ? (
        <p className="text-text-muted text-sm">Nu ai nicio comandă încă.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const items = JSON.parse(order.items) as OrderLine[];
            return (
              <Card key={order.id}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <p className="text-text-primary font-medium">{order.orderNumber}</p>
                    <p className="text-text-muted text-xs">
                      {new Date(order.createdAt).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge color="gold">{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                    <p
                      className={`text-xs mt-1 ${
                        order.paymentStatus === "paid"
                          ? "text-success"
                          : order.paymentStatus === "failed"
                            ? "text-error"
                            : order.paymentStatus === "pending"
                              ? "text-amber-300"
                              : "text-text-muted"
                      }`}
                    >
                      {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                    </p>
                    <p className="text-gold-300 font-heading text-lg mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <ul className="text-sm text-text-secondary space-y-1 border-t border-gold-400/8 pt-3">
                  {items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {item.name}
                        {item.variant ? ` (${item.variant})` : ""} × {item.quantity}
                      </span>
                      <span className="text-text-muted">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
