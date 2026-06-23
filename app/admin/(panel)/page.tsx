import Link from "next/link";
import { listOrders } from "@/lib/db/orders";
import { listMessages } from "@/lib/db/messages";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [orders, messages] = await Promise.all([listOrders(), listMessages()]);
  const newOrders = orders.filter((o) => o.status === "noua").length;
  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Comenzi noi", value: newOrders },
    { label: "Comenzi total", value: orders.length },
    { label: "Mesaje necitite", value: unread },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl">Panou administrare</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <p className="text-text-muted text-sm">{s.label}</p>
            <p className="font-heading text-3xl text-gold-300 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-lg mb-3">Ultimele comenzi</h2>
        <ul className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/comenzi/${o.id}`}
                className="card px-4 py-3 flex justify-between hover:border-gold-400/30 transition-colors"
              >
                <span>{o.id} · {o.customerFirstName} {o.customerLastName}</span>
                <span className="text-gold-300">{formatPrice(o.total)}</span>
              </Link>
            </li>
          ))}
          {orders.length === 0 && (
            <li className="text-text-muted text-sm">Nicio comandă încă.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
