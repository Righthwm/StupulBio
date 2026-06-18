# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single-admin login and an admin panel for viewing orders & contact messages and changing order status, persisting orders and messages to Postgres.

**Architecture:** Neon Postgres (Vercel Marketplace) + Drizzle ORM for two tables (`orders`, `contact_messages`). Admin auth uses env credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`): a server action verifies the password with bcrypt and issues a `jose`-signed JWT in an httpOnly cookie; a Next.js 16 `proxy.ts` guards `/admin/*` and server actions re-check the session. Admin pages are Server Components reading from the DB. The existing checkout & contact API routes write to the DB. Products stay hardcoded (out of scope).

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack), Drizzle ORM, `@neondatabase/serverless`, `bcryptjs`, `jose`, Vitest (unit tests for pure logic), Zod (already present).

---

## File Structure

**Create:**
- `lib/db/schema.ts` — Drizzle table definitions + inferred types
- `lib/db/index.ts` — Drizzle client (Neon HTTP driver)
- `lib/db/orders.ts` — order persistence + queries + pure `buildOrderRow` mapper
- `lib/db/messages.ts` — message persistence + queries
- `lib/auth/session.ts` — JWT sign/verify (jose only — no db/bcrypt imports; safe for proxy)
- `lib/auth/index.ts` — `getAdminSession()` / `requireAdmin()` for server components & actions
- `drizzle.config.ts` — drizzle-kit config
- `scripts/hash-password.ts` — prints a bcrypt hash for a password
- `proxy.ts` — protects `/admin/*`
- `app/admin/layout.tsx` — protected shell with sidebar
- `app/admin/page.tsx` — dashboard
- `app/admin/login/page.tsx` — login form (public)
- `app/admin/login/actions.ts` — `login` server action
- `app/admin/actions.ts` — `logout` server action
- `app/admin/comenzi/page.tsx` — orders list
- `app/admin/comenzi/[id]/page.tsx` — order detail + status form
- `app/admin/comenzi/actions.ts` — `updateStatus` server action
- `app/admin/mesaje/page.tsx` — messages list
- `app/admin/mesaje/actions.ts` — `markRead` server action
- `lib/auth/session.test.ts` — vitest unit test
- `lib/db/orders.test.ts` — vitest unit test for `buildOrderRow`
- `vitest.config.ts` — vitest config
- `.env.example` — documents required env vars

**Modify:**
- `package.json` — dependencies + scripts
- `app/api/checkout/route.ts` — persist order to DB
- `app/api/contact/route.ts` — persist message to DB

---

## Task 1: Install dependencies and add scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install drizzle-orm @neondatabase/serverless bcryptjs jose
npm install -D drizzle-kit dotenv tsx vitest @types/bcryptjs
```
Expected: installs succeed, `package.json` updated.

- [ ] **Step 2: Add npm scripts**

In `package.json`, add these to the `"scripts"` object (keep existing scripts):
```json
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "hash-password": "tsx scripts/hash-password.ts",
    "test": "vitest run"
```

- [ ] **Step 3: Verify**

Run: `npm ls drizzle-orm jose bcryptjs`
Expected: each prints an installed version, no "missing" errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add drizzle, auth, and test dependencies"
```

---

## Task 2: Env scaffolding and password hash script

**Files:**
- Create: `scripts/hash-password.ts`
- Create: `.env.example`

- [ ] **Step 1: Create the hash script**

`scripts/hash-password.ts`:
```ts
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- <password>");
  process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
```

- [ ] **Step 2: Generate the hash for the admin password**

Run: `npm run hash-password -- parola12`
Expected: prints a bcrypt hash like `$2b$10$....` (60 chars). Copy this value for the next step.

- [ ] **Step 3: Create `.env.example`**

`.env.example`:
```bash
# Neon Postgres connection string (from Vercel Marketplace integration)
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Admin account
ADMIN_EMAIL="stupulbio@outlook.com"
# bcrypt hash of the admin password — generate with: npm run hash-password -- <password>
ADMIN_PASSWORD_HASH="$2b$10$replace-with-output-of-hash-password-script"

# Random secret used to sign the admin session JWT.
# Generate with: openssl rand -base64 32
AUTH_SECRET="replace-with-a-long-random-string"
```

- [ ] **Step 4: Create `.env.local` (not committed)**

Create `.env.local` with the real values: `ADMIN_EMAIL=stupulbio@outlook.com`, `ADMIN_PASSWORD_HASH=<hash from Step 2>`, `AUTH_SECRET=<output of `openssl rand -base64 32`>`, and `DATABASE_URL` left as a placeholder until Task 3.
Confirm `.env.local` is git-ignored:

Run: `git check-ignore .env.local`
Expected: prints `.env.local` (meaning it is ignored).

- [ ] **Step 5: Commit**

```bash
git add scripts/hash-password.ts .env.example
git commit -m "chore: add password hash script and env example"
```

---

## Task 3: Provision Neon and create the database schema

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/index.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: Provision Neon Postgres (manual, user action)**

In the Vercel dashboard for this project: Storage → add a Neon Postgres database via the Marketplace. Then pull the connection string into `.env.local` as `DATABASE_URL` (e.g. `vercel env pull .env.local` once the CLI is linked, or copy it from the integration settings). The string must include `?sslmode=require`.

Verify the variable is present:

Run: `grep -c '^DATABASE_URL=' .env.local`
Expected: `1`

- [ ] **Step 2: Create the schema**

`lib/db/schema.ts`:
```ts
import {
  pgTable,
  pgEnum,
  text,
  integer,
  jsonb,
  boolean,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const ORDER_STATUSES = [
  "noua",
  "in_procesare",
  "expediat",
  "livrat",
  "anulata",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusEnum = pgEnum("order_status", ORDER_STATUSES);

export interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  unitPrice: number;
  quantity: number;
}

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerFirstName: text("customer_first_name").notNull(),
  customerLastName: text("customer_last_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingCounty: text("shipping_county").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),
  paymentMethod: text("payment_method").notNull(),
  notes: text("notes"),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  status: orderStatusEnum("status").notNull().default("noua"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
```

- [ ] **Step 3: Create the Drizzle client**

`lib/db/index.ts`:
```ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 4: Create the drizzle-kit config**

`drizzle.config.ts`:
```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 5: Generate and apply the migration**

Run:
```bash
npm run db:generate
npm run db:migrate
```
Expected: `db:generate` writes SQL files under `drizzle/`; `db:migrate` applies them with no errors.

- [ ] **Step 6: Verify tables exist**

Run: `npm run db:studio` (opens Drizzle Studio in the browser), confirm `orders` and `contact_messages` tables are present, then stop it with Ctrl-C.
Expected: both tables visible with the columns above.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add lib/db/schema.ts lib/db/index.ts drizzle.config.ts drizzle/
git commit -m "feat: add postgres schema and drizzle client for orders and messages"
```

---

## Task 4: Session helpers (TDD)

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/auth/session.ts`
- Test: `lib/auth/session.test.ts`

- [ ] **Step 1: Create the vitest config**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Write the failing test**

`lib/auth/session.test.ts`:
```ts
import { beforeAll, describe, expect, it } from "vitest";
import { createSession, verifySession } from "./session";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-value-for-unit-tests-only";
});

describe("session", () => {
  it("verifies a token it created", async () => {
    const token = await createSession();
    const payload = await verifySession(token);
    expect(payload?.role).toBe("admin");
  });

  it("returns null for a tampered token", async () => {
    const token = await createSession();
    const payload = await verifySession(token + "garbage");
    expect(payload).toBeNull();
  });

  it("returns null for an empty token", async () => {
    expect(await verifySession("")).toBeNull();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run lib/auth/session.test.ts`
Expected: FAIL — cannot import `./session` (module does not exist yet).

- [ ] **Step 4: Implement the session helpers**

`lib/auth/session.ts`:
```ts
import { SignJWT, jwtVerify } from "jose";

export interface AdminSession {
  role: "admin";
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin") return null;
    return { role: "admin" };
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run lib/auth/session.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts lib/auth/session.ts lib/auth/session.test.ts
git commit -m "feat: add signed admin session helpers with tests"
```

---

## Task 5: Auth guard for server components and actions

**Files:**
- Create: `lib/auth/index.ts`

- [ ] **Step 1: Implement the guard**

`lib/auth/index.ts`:
```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, type AdminSession } from "./session";

export const SESSION_COOKIE = "admin_session";

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/auth/index.ts
git commit -m "feat: add requireAdmin server-side guard"
```

---

## Task 6: Proxy route protection

**Files:**
- Create: `proxy.ts`

- [ ] **Step 1: Implement the proxy**

Next.js 16 renamed `middleware` to `proxy`. Create `proxy.ts` at the project root:
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself through.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value ?? "";
  const session = await verifySession(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
```

Note: `proxy.ts` imports only `lib/auth/session` (jose) — never the db or bcrypt — so it stays lightweight. Server actions still call `requireAdmin()` themselves (defense in depth), because the docs warn proxy matchers can be bypassed for Server Functions.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: protect /admin routes with proxy"
```

---

## Task 7: Login page and login/logout actions

**Files:**
- Create: `app/admin/login/actions.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/actions.ts`

- [ ] **Step 1: Create the login server action**

`app/admin/login/actions.ts`:
```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";

  const emailOk = email.trim().toLowerCase() === adminEmail.toLowerCase();
  const passwordOk = hash.length > 0 && (await bcrypt.compare(password, hash));

  if (!emailOk || !passwordOk) {
    return { error: "Email sau parolă incorecte." };
  }

  const token = await createSession();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}
```

- [ ] **Step 2: Create the logout server action**

`app/admin/actions.ts`:
```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
```

- [ ] **Step 3: Create the login page**

`app/admin/login/page.tsx`:
```tsx
"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <form
        action={formAction}
        className="card p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="font-heading text-2xl text-text-primary text-center">
          Administrare
        </h1>
        {state.error && (
          <p className="text-error text-sm text-center" role="alert">
            {state.error}
          </p>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2 text-text-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Parolă</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2 text-text-primary"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Se verifică…" : "Autentificare"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, visit `http://localhost:3000/admin` → expect redirect to `/admin/login`. Submit wrong credentials → "Email sau parolă incorecte." Submit `stupulbio@outlook.com` / `parola12` → redirect to `/admin` (will 404 until Task 8 — that's expected; the redirect itself confirms login works). Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add app/admin/login/actions.ts app/admin/login/page.tsx app/admin/actions.ts
git commit -m "feat: add admin login page with login/logout actions"
```

---

## Task 8: Admin layout, sidebar, and dashboard

**Files:**
- Create: `lib/db/orders.ts` (query helpers used here and in Task 9)
- Create: `lib/db/messages.ts` (query helpers used here and in Task 10)
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create order query helpers**

`lib/db/orders.ts`:
```ts
import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { orders, ORDER_STATUSES, type Order, type OrderStatus } from "./schema";

export function listOrders(): Promise<Order[]> {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0];
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}
```

- [ ] **Step 2: Create message query helpers**

`lib/db/messages.ts`:
```ts
import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { contactMessages, type ContactMessage } from "./schema";

export function listMessages(): Promise<ContactMessage[]> {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: number): Promise<void> {
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}
```

- [ ] **Step 3: Create the admin layout**

`app/admin/layout.tsx`:
```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      <aside className="w-56 shrink-0 border-r border-gold-400/10 p-6 flex flex-col gap-6">
        <Link href="/admin" className="font-heading text-xl text-gold-300">
          Stupul Bio
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin/comenzi" className="hover:text-gold-300 transition-colors">
            Comenzi
          </Link>
          <Link href="/admin/mesaje" className="hover:text-gold-300 transition-colors">
            Mesaje
          </Link>
        </nav>
        <form action={logout} className="mt-auto">
          <button type="submit" className="text-text-muted text-sm hover:text-error transition-colors">
            Delogare
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
```

Note: the login page lives at `app/admin/login` and is also wrapped by this layout, but `requireAdmin()` redirects unauthenticated users straight to `/admin/login`, so when the layout renders for the login route the user is already there — no loop. The proxy lets `/admin/login` through regardless.

- [ ] **Step 4: Create the dashboard**

`app/admin/page.tsx`:
```tsx
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
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, log in, confirm `/admin` shows three stat cards (all zero) and "Nicio comandă încă." Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add lib/db/orders.ts lib/db/messages.ts app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: add admin layout, sidebar, and dashboard"
```

---

## Task 9: Orders list, detail, and status update

**Files:**
- Create: `app/admin/comenzi/actions.ts`
- Create: `app/admin/comenzi/page.tsx`
- Create: `app/admin/comenzi/[id]/page.tsx`

- [ ] **Step 1: Create the status-update action**

`app/admin/comenzi/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isOrderStatus, setOrderStatus } from "@/lib/db/orders";

export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !isOrderStatus(status)) return;
  await setOrderStatus(id, status);
  revalidatePath("/admin/comenzi");
  revalidatePath(`/admin/comenzi/${id}`);
}
```

- [ ] **Step 2: Create the orders list page**

`app/admin/comenzi/page.tsx`:
```tsx
import Link from "next/link";
import { listOrders } from "@/lib/db/orders";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  noua: "Nouă",
  in_procesare: "În procesare",
  expediat: "Expediat",
  livrat: "Livrat",
  anulata: "Anulată",
};

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
                <td className="py-2 pr-4">{STATUS_LABELS[o.status]}</td>
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
```

- [ ] **Step 3: Create the order detail page**

`app/admin/comenzi/[id]/page.tsx`:
```tsx
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
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/admin/comenzi/
git commit -m "feat: add admin orders list, detail, and status update"
```

---

## Task 10: Messages list and mark-as-read

**Files:**
- Create: `app/admin/mesaje/actions.ts`
- Create: `app/admin/mesaje/page.tsx`

- [ ] **Step 1: Create the mark-read action**

`app/admin/mesaje/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { markMessageRead } from "@/lib/db/messages";

export async function markRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await markMessageRead(id);
  revalidatePath("/admin/mesaje");
}
```

- [ ] **Step 2: Create the messages page**

`app/admin/mesaje/page.tsx`:
```tsx
import { listMessages } from "@/lib/db/messages";
import { markRead } from "./actions";

export default async function MessagesPage() {
  const messages = await listMessages();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl">Mesaje</h1>
      {messages.length === 0 ? (
        <p className="text-text-muted text-sm">Niciun mesaj încă.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`card p-5 ${m.read ? "" : "border-gold-400/40"}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {m.name}{" "}
                    {!m.read && <span className="text-gold-300 text-xs">(necitit)</span>}
                  </p>
                  <p className="text-text-muted text-xs">
                    {m.email}{m.phone ? ` · ${m.phone}` : ""} · {m.subject}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                  <p className="text-text-muted text-xs mt-2">
                    {new Date(m.createdAt).toLocaleDateString("ro-RO")}
                  </p>
                </div>
                {!m.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="btn-secondary text-xs px-3 py-1 whitespace-nowrap">
                      Marchează citit
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/mesaje/
git commit -m "feat: add admin messages list with mark-as-read"
```

---

## Task 11: Persist orders from checkout (TDD for the mapper)

**Files:**
- Modify: `lib/db/orders.ts`
- Test: `lib/db/orders.test.ts`
- Modify: `app/api/checkout/route.ts`

- [ ] **Step 1: Write the failing test for the pure mapper**

`lib/db/orders.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { buildOrderRow } from "./orders";

const order = {
  customer: { firstName: "Ion", lastName: "Pop", email: "ion@example.com", phone: "0712345678" },
  shippingAddress: { county: "Cluj", city: "Cluj-Napoca", address: "Str. Florilor 1", postalCode: "400000" },
  paymentMethod: "ramburs" as const,
  notes: "fără sonerie",
  items: [{ productId: "miere-salcam", name: "Miere de Salcâm", variant: "1kg", unitPrice: 50, quantity: 2 }],
  totals: { subtotal: 100, shipping: 0, total: 100 },
};

describe("buildOrderRow", () => {
  it("flattens the parsed order into a db row", () => {
    const row = buildOrderRow("SB-ABC", order);
    expect(row).toMatchObject({
      id: "SB-ABC",
      customerFirstName: "Ion",
      customerLastName: "Pop",
      customerEmail: "ion@example.com",
      customerPhone: "0712345678",
      shippingCounty: "Cluj",
      shippingCity: "Cluj-Napoca",
      shippingAddress: "Str. Florilor 1",
      shippingPostalCode: "400000",
      paymentMethod: "ramburs",
      notes: "fără sonerie",
      subtotal: 100,
      shipping: 0,
      total: 100,
    });
    expect(row.items).toHaveLength(1);
    expect(row.items[0].productId).toBe("miere-salcam");
  });

  it("defaults notes to null when missing", () => {
    const { notes, ...rest } = order;
    void notes;
    const row = buildOrderRow("SB-XYZ", rest);
    expect(row.notes).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/db/orders.test.ts`
Expected: FAIL — `buildOrderRow` is not exported.

- [ ] **Step 3: Add the mapper and createOrder to `lib/db/orders.ts`**

Add these imports and exports to `lib/db/orders.ts` (keep the existing content from Task 8):
```ts
import { type NewOrder, type OrderItem } from "./schema";

export interface ParsedOrderInput {
  customer: { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress: { county: string; city: string; address: string; postalCode: string };
  paymentMethod: "card" | "ramburs";
  notes?: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
}

export function buildOrderRow(id: string, order: ParsedOrderInput): NewOrder {
  return {
    id,
    customerFirstName: order.customer.firstName,
    customerLastName: order.customer.lastName,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone,
    shippingCounty: order.shippingAddress.county,
    shippingCity: order.shippingAddress.city,
    shippingAddress: order.shippingAddress.address,
    shippingPostalCode: order.shippingAddress.postalCode,
    paymentMethod: order.paymentMethod,
    notes: order.notes ?? null,
    items: order.items,
    subtotal: order.totals.subtotal,
    shipping: order.totals.shipping,
    total: order.totals.total,
  };
}

export async function createOrder(id: string, order: ParsedOrderInput): Promise<void> {
  await db.insert(orders).values(buildOrderRow(id, order));
}
```

Note: `db` and `orders` are already imported at the top of the file from Task 8. Merge the new `import { type NewOrder, type OrderItem }` into the existing `from "./schema"` import line rather than duplicating it.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/db/orders.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Wire the checkout route to persist**

Modify `app/api/checkout/route.ts`. Add the import at the top:
```ts
import { createOrder } from "@/lib/db/orders";
```
Replace the `console.log("[Order placed]", ...)` block with a DB insert. The final `try` body becomes:
```ts
    const body: unknown = await request.json();
    const order = orderSchema.parse(body);

    // Card payments never reach this mock with real card data — the card fields
    // are validated client-side only and intentionally not sent to the server.
    const orderId = `SB-${Date.now().toString(36).toUpperCase()}`;

    await createOrder(orderId, {
      customer: order.customer,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      items: order.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        variant: i.variant,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      totals: order.totals,
    });

    return NextResponse.json({ success: true, orderId }, { status: 201 });
```
The existing `catch` block already returns 500 on unexpected errors, so a DB failure now correctly fails the order instead of falsely confirming it.

- [ ] **Step 6: Typecheck and test**

Run: `npx tsc --noEmit && npx vitest run`
Expected: no type errors; all tests pass.

- [ ] **Step 7: Manual verification**

Run `npm run dev`, add a product to the cart, complete checkout. Then log into `/admin/comenzi` and confirm the order appears with correct customer, items, and total. Open it, change status to "Expediat", save, and confirm it persists after reload. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add lib/db/orders.ts lib/db/orders.test.ts app/api/checkout/route.ts
git commit -m "feat: persist orders to db from checkout"
```

---

## Task 12: Persist contact messages

**Files:**
- Modify: `lib/db/messages.ts`
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Add createMessage to `lib/db/messages.ts`**

Add to `lib/db/messages.ts` (keep existing content from Task 8):
```ts
import { type ContactMessage } from "./schema";

export interface NewMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function createMessage(input: NewMessageInput): Promise<void> {
  await db.insert(contactMessages).values({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject,
    message: input.message,
  });
}
```

Note: merge the `import { type ContactMessage }` into the existing `from "./schema"` import line. `ContactMessage` may already be imported there from Task 8 — if so, no new import is needed.

- [ ] **Step 2: Wire the contact route to persist**

Modify `app/api/contact/route.ts`. Add the import:
```ts
import { createMessage } from "@/lib/db/messages";
```
Replace the `console.log("[Contact form submission]", ...)` block with:
```ts
    await createMessage({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run `npm run dev`, submit the contact form on the site, then open `/admin/mesaje` and confirm the message appears as unread with the correct fields. Click "Marchează citit" and confirm the unread marker disappears after reload. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add lib/db/messages.ts app/api/contact/route.ts
git commit -m "feat: persist contact messages to db"
```

---

## Task 13: Final verification

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; production build succeeds.

- [ ] **Step 3: End-to-end smoke test**

Run `npm run dev` and verify the full flow:
1. `/admin` while logged out → redirects to `/admin/login`.
2. Wrong credentials → error message; correct credentials (`stupulbio@outlook.com` / `parola12`) → dashboard.
3. Place an order on the storefront → appears in `/admin/comenzi`; status change persists.
4. Submit the contact form → appears in `/admin/mesaje`; mark-as-read persists.
5. Click "Delogare" → redirected to login; `/admin` again redirects to login.

- [ ] **Step 4: Final commit (if any uncommitted changes remain)**

```bash
git add -A
git commit -m "chore: admin panel final verification"
```

---

## Notes for the executor

- **Env required before runtime tasks:** Tasks 8–13 need `DATABASE_URL` (Task 3), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET` (Task 2) in `.env.local`.
- **Neon provisioning (Task 3 Step 1) is a manual user action** via the Vercel dashboard; the plan cannot automate it. The unit tests (Tasks 4 & 11) do not require a database; the DB-backed manual verifications do.
- **Do not import `lib/db` or `bcryptjs` into `proxy.ts`** — it must stay limited to `lib/auth/session` (jose) so it remains lightweight and edge-safe.
- Prices are whole-lei integers, matching `lib/products.ts`. `formatPrice` from `lib/utils` handles display.
