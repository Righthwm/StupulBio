import Link from "next/link";
import { listOrders } from "@/lib/db/orders";
import { ORDER_STATUS_LABELS } from "@/lib/db/schema";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl">Comenzi</h1>
      {orders.length === 0 ? (
        <p className="text-text-muted text-sm">Nicio comandă încă.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-text-muted text-left border-b border-gold-400/10">
            <tr>
              <th className="py-2 pr-4">Comandă</th>
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Dată</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gold-400/5 hover:bg-gold-400/5">
                <td className="py-2 pr-4">
                  <Link href={`/admin/comenzi/${o.id}`} className="text-gold-300">
                    {o.id}
                  </Link>
                </td>
                <td className="py-2 pr-4">{o.customerFirstName} {o.customerLastName}</td>
                <td className="py-2 pr-4">{formatPrice(o.total)}</td>
                <td className="py-2 pr-4">{ORDER_STATUS_LABELS[o.status]}</td>
                <td className="py-2 pr-4">
                  {new Date(o.createdAt).toLocaleDateString("ro-RO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
