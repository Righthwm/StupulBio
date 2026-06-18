import { notFound } from "next/navigation";
import { getOrder } from "@/lib/db/orders";
import { ORDER_STATUSES } from "@/lib/db/schema";
import { formatPrice } from "@/lib/utils";
import { updateStatus } from "../actions";

const STATUS_LABELS: Record<string, string> = {
  noua: "Nouă",
  in_procesare: "În procesare",
  expediat: "Expediat",
  livrat: "Livrat",
  anulata: "Anulată",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-heading text-2xl">Comanda {order.id}</h1>

      <div className="card p-6 space-y-1 text-sm">
        <p className="font-semibold">{order.customerFirstName} {order.customerLastName}</p>
        <p className="text-text-muted">{order.customerEmail} · {order.customerPhone}</p>
        <p className="text-text-muted">
          {order.shippingAddress}, {order.shippingCity}, {order.shippingCounty} {order.shippingPostalCode}
        </p>
        <p className="text-text-muted">Plată: {order.paymentMethod}</p>
        {order.notes && <p className="text-text-muted">Note: {order.notes}</p>}
      </div>

      <div className="card p-6">
        <h2 className="font-heading text-lg mb-3">Produse</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.name}{item.variant ? ` · ${item.variant}` : ""} × {item.quantity}</span>
              <span className="text-gold-300">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 pt-4 border-t border-gold-400/10 text-sm space-y-1">
          <div className="flex justify-between"><dt className="text-text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-text-muted">Transport</dt><dd>{order.shipping === 0 ? "Gratuit" : formatPrice(order.shipping)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Total</dt><dd className="text-gold-300">{formatPrice(order.total)}</dd></div>
        </dl>
      </div>

      <form action={updateStatus} className="card p-6 flex items-end gap-3">
        <input type="hidden" name="id" value={order.id} />
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="text-text-muted">Status</span>
          <select
            name="status"
            defaultValue={order.status}
            className="bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary">Salvează</button>
      </form>
    </div>
  );
}
