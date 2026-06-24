import { Resend } from "resend";
import { formatPrice } from "./utils";

export interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  unitPrice: number;
  quantity: number;
}

/**
 * Notification emails via Resend (HTTP API). Configured entirely from the
 * environment so no credentials live in the repo.
 *
 * MAIL_FROM must be an address on a Resend-verified domain. For initial testing
 * Resend's shared sender "onboarding@resend.dev" works, but it only delivers to
 * the email you registered the Resend account with — so register Resend with
 * the same address as MAIL_TO.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const MAIL_FROM = process.env.MAIL_FROM ?? "Stupul Bio <onboarding@resend.dev>";
const MAIL_TO = process.env.MAIL_TO ?? "stupulbio@outlook.com";

let client: Resend | null = null;

function getClient(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!client) {
    client = new Resend(RESEND_API_KEY);
  }
  return client;
}

interface OutgoingEmail {
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

/** Send via Resend and throw on failure so the caller surfaces an error. */
async function send({ replyTo, subject, html, text }: OutgoingEmail): Promise<void> {
  const { error } = await getClient().emails.send({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo,
    subject,
    html,
    text,
  });
  if (error) {
    throw new Error(`Resend error: ${error.name} — ${error.message}`);
  }
}

/** Escape user-supplied text before interpolating it into the HTML body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface OrderEmailData {
  orderId: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress: { county: string; city: string; address: string; postalCode: string };
  paymentMethod: "card" | "ramburs";
  notes?: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
}

export async function sendOrderEmail(data: OrderEmailData): Promise<void> {
  const { customer, shippingAddress: addr, totals } = data;
  const payment = data.paymentMethod === "card" ? "Card" : "Ramburs (plata la livrare)";

  const rows = data.items
    .map(
      (i) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(i.name)}${
            i.variant ? ` <span style="color:#888">(${esc(i.variant)})</span>` : ""
          }</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.unitPrice)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.unitPrice * i.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:640px">
      <h2 style="color:#B5700A">Comandă nouă — ${esc(data.orderId)}</h2>
      <h3>Client</h3>
      <p>
        ${esc(customer.firstName)} ${esc(customer.lastName)}<br>
        Email: <a href="mailto:${esc(customer.email)}">${esc(customer.email)}</a><br>
        Telefon: ${esc(customer.phone)}
      </p>
      <h3>Adresă de livrare</h3>
      <p>
        ${esc(addr.address)}<br>
        ${esc(addr.city)}, jud. ${esc(addr.county)}, ${esc(addr.postalCode)}
      </p>
      <h3>Produse</h3>
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:#f7f1e3">
            <th style="padding:6px 10px;text-align:left">Produs</th>
            <th style="padding:6px 10px;text-align:center">Cant.</th>
            <th style="padding:6px 10px;text-align:right">Preț unitar</th>
            <th style="padding:6px 10px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:16px">
        Subtotal: ${formatPrice(totals.subtotal)}<br>
        Transport: ${formatPrice(totals.shipping)}<br>
        <strong style="font-size:16px">Total: ${formatPrice(totals.total)}</strong>
      </p>
      <p>Plată: <strong>${payment}</strong></p>
      ${data.notes ? `<h3>Observații</h3><p>${esc(data.notes)}</p>` : ""}
    </div>`;

  const text = [
    `Comandă nouă — ${data.orderId}`,
    ``,
    `Client: ${customer.firstName} ${customer.lastName}`,
    `Email: ${customer.email}`,
    `Telefon: ${customer.phone}`,
    ``,
    `Adresă: ${addr.address}, ${addr.city}, jud. ${addr.county}, ${addr.postalCode}`,
    ``,
    `Produse:`,
    ...data.items.map(
      (i) =>
        `- ${i.name}${i.variant ? ` (${i.variant})` : ""} x${i.quantity} — ${formatPrice(
          i.unitPrice
        )} (subtotal ${formatPrice(i.unitPrice * i.quantity)})`
    ),
    ``,
    `Subtotal: ${formatPrice(totals.subtotal)}`,
    `Transport: ${formatPrice(totals.shipping)}`,
    `Total: ${formatPrice(totals.total)}`,
    `Plată: ${payment}`,
    ...(data.notes ? [``, `Observații: ${data.notes}`] : []),
  ].join("\n");

  await send({
    replyTo: customer.email,
    subject: `Comandă nouă ${data.orderId} — ${customer.firstName} ${customer.lastName}`,
    text,
    html,
  });
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:640px">
      <h2 style="color:#B5700A">Mesaj nou de contact</h2>
      <p>
        <strong>Nume:</strong> ${esc(data.name)}<br>
        <strong>Email:</strong> <a href="mailto:${esc(data.email)}">${esc(data.email)}</a><br>
        ${data.phone ? `<strong>Telefon:</strong> ${esc(data.phone)}<br>` : ""}
        <strong>Subiect:</strong> ${esc(data.subject)}
      </p>
      <h3>Mesaj</h3>
      <p style="white-space:pre-wrap">${esc(data.message)}</p>
    </div>`;

  const text = [
    `Mesaj nou de contact`,
    ``,
    `Nume: ${data.name}`,
    `Email: ${data.email}`,
    ...(data.phone ? [`Telefon: ${data.phone}`] : []),
    `Subiect: ${data.subject}`,
    ``,
    `Mesaj:`,
    data.message,
  ].join("\n");

  await send({
    replyTo: data.email,
    subject: `Mesaj contact: ${data.subject} — ${data.name}`,
    text,
    html,
  });
}
