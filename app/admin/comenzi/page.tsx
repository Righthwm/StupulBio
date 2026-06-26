import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Admin · Comenzi" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-text-primary">Comenzi ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="text-text-muted text-sm">Nicio comandă încă.</p>
      ) : (
        <div className="overflow-x-auto border border-gold-400/10 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-surface text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left font-medium px-3 py-2">Comandă</th>
                <th className="text-left font-medium px-3 py-2">Client</th>
                <th className="text-left font-medium px-3 py-2">Produse</th>
                <th className="text-right font-medium px-3 py-2">Total</th>
                <th className="text-left font-medium px-3 py-2">Plată</th>
                <th className="text-left font-medium px-3 py-2">Status</th>
                <th className="text-left font-medium px-3 py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const items = JSON.parse(o.items) as { name: string; quantity: number }[];
                const count = items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={o.id} className="border-t border-gold-400/8 align-top">
                    <td className="px-3 py-2 text-text-primary font-mono text-xs">{o.orderNumber}</td>
                    <td className="px-3 py-2 text-text-secondary">
                      {o.customerFirstName} {o.customerLastName}
                      <span className="block text-text-muted text-xs">{o.customerEmail}</span>
                    </td>
                    <td className="px-3 py-2 text-text-muted">{count} buc.</td>
                    <td className="px-3 py-2 text-right text-gold-300">{formatPrice(o.total)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          o.paymentStatus === "paid"
                            ? "text-success"
                            : o.paymentStatus === "failed"
                              ? "text-error"
                              : o.paymentStatus === "pending"
                                ? "text-amber-300"
                                : "text-text-muted"
                        }
                      >
                        {PAYMENT_STATUS_LABELS[o.paymentStatus] ?? o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Badge color="gold">{ORDER_STATUS_LABELS[o.status] ?? o.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-text-muted whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
