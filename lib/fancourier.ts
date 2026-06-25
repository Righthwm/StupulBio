/**
 * Fan Courier tariff client, implemented per the official API doc
 * (RO_FANCourier_API, https://www.fancourier.ro/api-curierat/):
 *   - Auth:   POST /login?username=&password=   -> { data: { token, expiresAt } }
 *   - Tariff: GET  /reports/awb/internal-tariff  -> { data: { total, ... } }  (incl. VAT)
 *
 * Credentials + clientId come from the environment (empty by default). When
 * missing or the API fails, `estimateTariff` throws `FanCourierUnavailableError`
 * so callers fall back to "se calculează la livrare".
 */
const BASE_URL = process.env.FAN_COURIER_API_URL ?? "https://api.fancourier.ro";
const USERNAME = process.env.FAN_COURIER_USERNAME ?? "";
const PASSWORD = process.env.FAN_COURIER_PASSWORD ?? "";
/** SelfAWB branch client id (required by the tariff endpoint). */
const CLIENT_ID = process.env.FAN_COURIER_CLIENT_ID ?? "";
/** Service name from {{url}}/reports/services (e.g. "Standard", "Cont Colector"). */
const SERVICE = process.env.FAN_COURIER_SERVICE ?? "Standard";

export class FanCourierUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FanCourierUnavailableError";
  }
}

export function isFanCourierConfigured(): boolean {
  return USERNAME.length > 0 && PASSWORD.length > 0 && CLIENT_ID.length > 0;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (!isFanCourierConfigured()) {
    throw new FanCourierUnavailableError("Fan Courier credentials are not configured");
  }
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  // Login takes credentials as query params (per the doc) and returns the token.
  const loginUrl = `${BASE_URL}/login?username=${encodeURIComponent(USERNAME)}&password=${encodeURIComponent(PASSWORD)}`;
  const res = await fetch(loginUrl, { method: "POST", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    throw new FanCourierUnavailableError(`Fan Courier login failed (HTTP ${res.status})`);
  }
  const json = (await res.json()) as {
    status?: string;
    data?: { token?: string; expiresAt?: string };
  };
  const token = json.data?.token;
  if (!token) {
    throw new FanCourierUnavailableError("Fan Courier login: token missing in response");
  }
  // Token is valid 24h; cache until `expiresAt` (minus a margin), or 23h.
  const expiresAt = json.data?.expiresAt ? Date.parse(json.data.expiresAt) - 5 * 60_000 : 0;
  cachedToken = {
    token,
    expiresAt: Number.isNaN(expiresAt) || expiresAt <= Date.now() ? Date.now() + 23 * 60 * 60 * 1000 : expiresAt,
  };
  return token;
}

export interface TariffInput {
  /** Recipient county (e.g. "Cluj"). */
  county: string;
  /** Recipient locality (must match Fan Courier's nomenclature). */
  locality: string;
  /** Collected for the address; Fan Courier derives cost from the locality, so not sent. */
  localityType?: "urban" | "rural";
  weightKg: number;
  /** Cash-on-delivery amount in lei (kept for the caller; not a tariff field). */
  cashOnDelivery?: number;
  /** Declared parcel value in lei (insurance basis). */
  declaredValue?: number;
}

/** Returns the shipping tariff in whole lei (incl. VAT), or throws FanCourierUnavailableError. */
export async function estimateTariff(input: TariffInput): Promise<number> {
  const token = await getToken();

  const params = new URLSearchParams();
  params.set("clientId", CLIENT_ID);
  params.set("info[service]", SERVICE);
  params.set("info[payment]", "expeditor"); // sender (the shop) pays the courier
  params.set("info[weight]", String(input.weightKg));
  params.set("info[packages][parcel]", "1");
  params.set("info[packages][envelope]", "0");
  if (input.declaredValue && input.declaredValue > 0) {
    params.set("info[declaredValue]", String(input.declaredValue));
  }
  params.set("recipient[locality]", input.locality);
  params.set("recipient[county]", input.county);

  const res = await fetch(`${BASE_URL}/reports/awb/internal-tariff?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new FanCourierUnavailableError(`Fan Courier tariff failed (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { status?: string; data?: { total?: number } };
  const total = json.data?.total;
  if (typeof total !== "number" || Number.isNaN(total)) {
    throw new FanCourierUnavailableError("Fan Courier tariff: unexpected response shape");
  }
  return Math.round(total);
}
