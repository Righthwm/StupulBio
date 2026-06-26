import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ClearCartOnPaid } from "./ClearCartOnPaid";

export const metadata: Metadata = { title: "Rezultat plată" };
export const dynamic = "force-dynamic";

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId
    ? await prisma.order.findUnique({
        where: { orderNumber: orderId },
        select: { orderNumber: true, paymentStatus: true, total: true },
      })
    : null;

  const status = order?.paymentStatus ?? "missing";

  return (
    <div className="bg-bg-primary pt-20 min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="card p-10">
          {status === "paid" && (
            <>
              <ClearCartOnPaid />
              <CheckCircle size={56} className="text-success mx-auto mb-5" />
              <h1 className="font-heading text-3xl text-text-primary mb-3" style={{ fontSize: "2rem" }}>
                Plată reușită!
              </h1>
              <p className="text-text-secondary mb-6">
                Mulțumim! Comanda <strong className="text-gold-300">{order?.orderNumber}</strong> a fost
                plătită ({formatPrice(order!.total)}). Vei primi un email de confirmare.
              </p>
              <Link href="/magazin" className="btn-primary">Înapoi la magazin</Link>
            </>
          )}

          {status === "pending" && (
            <>
              <Clock size={56} className="text-gold-400 mx-auto mb-5" />
              <h1 className="font-heading text-3xl text-text-primary mb-3" style={{ fontSize: "2rem" }}>
                Plata se procesează
              </h1>
              <p className="text-text-secondary mb-6">
                Confirmăm plata pentru comanda <strong className="text-gold-300">{order?.orderNumber}</strong>.
                Reîmprospătează pagina în câteva momente sau verifică emailul.
              </p>
              <Link
                href={`/payment/return?orderId=${encodeURIComponent(order?.orderNumber ?? "")}`}
                className="btn-secondary"
                prefetch={false}
              >
                Reîmprospătează
              </Link>
            </>
          )}

          {(status === "failed" || status === "missing" || status === "n/a") && (
            <>
              <AlertCircle size={56} className="text-error mx-auto mb-5" />
              <h1 className="font-heading text-3xl text-text-primary mb-3" style={{ fontSize: "2rem" }}>
                Plata nu a reușit
              </h1>
              <p className="text-text-secondary mb-6">
                {status === "missing"
                  ? "Nu am găsit comanda."
                  : "Plata a fost anulată sau respinsă. Poți reîncerca."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/checkout" className="btn-primary">Reîncearcă plata</Link>
                <Link href="/magazin" className="btn-secondary">Magazin</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
