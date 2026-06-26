import crypto from "node:crypto";

/**
 * Netopia Payments (v2 hosted-card) client. All Netopia-specific request/response
 * and IPN-signature mapping is isolated here behind clearly marked blocks, so it
 * can be confirmed/tweaked against the live v2 docs once sandbox credentials are
 * available. Credentials come from the environment; sandbox is the default.
 */
const SANDBOX_URL = process.env.NETOPIA_SANDBOX_URL ?? "https://secure.sandbox.netopia-payments.com";
const LIVE_URL = process.env.NETOPIA_LIVE_URL ?? "https://secure.netopia-payments.com";
const IS_LIVE = process.env.NETOPIA_LIVE === "true";
const BASE_URL = IS_LIVE ? LIVE_URL : SANDBOX_URL;

const API_KEY = process.env.NETOPIA_API_KEY ?? "";
const POS_SIGNATURE = process.env.NETOPIA_POS_SIGNATURE ?? "";
// Netopia's public key (PEM) used to verify the IPN signature. Supports \n-escaped env values.
const PUBLIC_KEY = (process.env.NETOPIA_PUBLIC_KEY ?? "").replace(/\\n/g, "\n");

export class NetopiaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetopiaError";
  }
}

/** Card payments can only run once an API key + POS signature are configured. */
export function isNetopiaConfigured(): boolean {
  return API_KEY.length > 0 && POS_SIGNATURE.length > 0;
}

export interface StartPaymentInput {
  orderId: string;
  /** Amount in RON (decimal, e.g. 49.5). */
  amount: number;
  currency?: string;
  description: string;
  billing: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    postalCode: string;
    details: string;
  };
  /** Server-to-server IPN URL. */
  notifyUrl: string;
  /** Browser return URL. */
  redirectUrl: string;
}

export interface StartPaymentResult {
  /** Where to send the customer's browser (hosted card page / 3D Secure). */
  redirectUrl: string;
  /** Netopia transaction id. */
  ntpID: string;
}

export async function startPayment(input: StartPaymentInput): Promise<StartPaymentResult> {
  if (!isNetopiaConfigured()) {
    throw new NetopiaError("Netopia is not configured");
  }

  // ===== ADJUST to the live v2 "card/start" schema when sandbox creds exist =====
  const body = {
    config: { notifyUrl: input.notifyUrl, redirectUrl: input.redirectUrl, language: "ro" },
    payment: { options: { installments: 0, bonus: 0 }, instrument: { type: "card" } },
    order: {
      ntpID: "",
      posSignature: POS_SIGNATURE,
      dateTime: new Date().toISOString(),
      description: input.description,
      orderID: input.orderId,
      amount: input.amount,
      currency: input.currency ?? "RON",
      billing: {
        email: input.billing.email,
        phone: input.billing.phone,
        firstName: input.billing.firstName,
        lastName: input.billing.lastName,
        city: input.billing.city,
        country: 642,
        countryName: "Romania",
        state: input.billing.city,
        postalCode: input.billing.postalCode,
        details: input.billing.details,
      },
    },
  };

  const res = await fetch(`${BASE_URL}/payment/card/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: API_KEY },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new NetopiaError(`Netopia start failed (HTTP ${res.status})`);
  }

  const json = (await res.json()) as {
    payment?: { ntpID?: string; paymentURL?: string };
    customerAction?: { url?: string };
  };
  // ===== ADJUST: redirect URL + ntpID location in the v2 response =====
  const redirectUrl = json.payment?.paymentURL ?? json.customerAction?.url;
  const ntpID = json.payment?.ntpID ?? "";
  if (!redirectUrl) {
    throw new NetopiaError("Netopia start: no redirect URL in response");
  }
  return { redirectUrl, ntpID };
}

export type PaymentOutcome = "paid" | "failed" | "pending";

export interface IpnResult {
  orderId: string;
  ntpID: string;
  status: PaymentOutcome;
  /** True when the IPN signature checks out against Netopia's public key. */
  verified: boolean;
}

/** Map Netopia numeric status codes to our payment outcome. */
function normalizeStatus(raw: unknown): PaymentOutcome {
  // ===== ADJUST to the documented v2 status codes =====
  const n = Number(raw);
  if (n === 3 || n === 5) return "paid"; // confirmed / paid
  if (n === 12 || n === 14 || n === 15) return "failed"; // declined / error / 3DS failed
  return "pending";
}

/** Verify the IPN signature token (JWT, RS512) against Netopia's public key. */
function verifyToken(token: string | null, payload: string): boolean {
  if (!PUBLIC_KEY || !token) return false;
  try {
    // ===== ADJUST to the exact IPN signature scheme (JWT vs detached signature) =====
    const parts = token.split(".");
    if (parts.length === 3) {
      const signed = `${parts[0]}.${parts[1]}`;
      return crypto.verify("RSA-SHA512", Buffer.from(signed), PUBLIC_KEY, Buffer.from(parts[2], "base64url"));
    }
    // Fallback: token is a detached base64 signature over the raw body.
    return crypto.verify("RSA-SHA512", Buffer.from(payload), PUBLIC_KEY, Buffer.from(token, "base64"));
  } catch {
    return false;
  }
}

/** Parse + verify an IPN (server-to-server confirmation) from Netopia. */
export function verifyIpn(rawBody: string, verificationToken: string | null): IpnResult {
  const data = JSON.parse(rawBody) as {
    order?: { orderID?: string };
    orderID?: string;
    payment?: { ntpID?: string; status?: unknown };
  };
  // ===== ADJUST: order id + status location in the v2 IPN body =====
  const orderId = data.order?.orderID ?? data.orderID ?? "";
  const ntpID = data.payment?.ntpID ?? "";
  return {
    orderId,
    ntpID,
    status: normalizeStatus(data.payment?.status),
    verified: verifyToken(verificationToken, rawBody),
  };
}
