# Design: Cont admin + panou comenzi & mesaje

**Data:** 2026-06-18
**Status:** Aprobat — gata pentru plan de implementare

## Context

Site de e-commerce Stupul Bio (Next.js 16.2.9, App Router, Turbopack; React, zustand,
zod, framer-motion). În prezent **nu există bază de date și nici autentificare**:

- Comenzile din `app/api/checkout/route.ts` sunt doar `console.log` și se pierd.
- Mesajele din `app/api/contact/route.ts` la fel.
- Produsele sunt hardcodate în `lib/products.ts`.

Obiectiv: un **cont de admin** (un singur utilizator — proprietarul) care se loghează și
accesează un **panou de administrare** pentru a vedea comenzile și mesajele de contact,
și a schimba statusul comenzilor.

## Decizii luate (brainstorming)

- **Cont:** un singur cont de admin. Clienții comandă în continuare fără cont.
- **Funcții admin:** vezi comenzi, schimbă status comandă, vezi mesaje de contact.
  **Gestionarea produselor este EXCLUSĂ** — produsele rămân hardcodate în cod permanent.
- **Stocare:** Postgres pe Vercel (Neon, prin Marketplace) + Drizzle ORM.
- **Setare cont:** credențiale din variabile de mediu (fără pagină de înregistrare).

## Out of scope (YAGNI)

Conturi de clienți, gestionare/CRUD produse, migrarea produselor în DB, rate-limiting la
login, recuperare parolă, multi-admin, notificări email.

## Arhitectură

### 1. Bază de date — Neon Postgres + Drizzle

- Integrare Neon prin Vercel Marketplace → furnizează `DATABASE_URL`.
- `drizzle-orm` + `drizzle-kit` (migrații). Driver `@neondatabase/serverless`
  (`drizzle-orm/neon-http`), compatibil atât local cât și pe Vercel.
- Fișiere: `lib/db/schema.ts` (tabele), `lib/db/index.ts` (client Drizzle).
- `drizzle.config.ts` la rădăcină.

**Tabel `orders`:**

| coloană | tip | note |
|---|---|---|
| `id` | text PK | id-ul `SB-XXXX` generat în checkout |
| `customer_first_name` | text | |
| `customer_last_name` | text | |
| `customer_email` | text | |
| `customer_phone` | text | |
| `shipping_county` | text | |
| `shipping_city` | text | |
| `shipping_address` | text | |
| `shipping_postal_code` | text | |
| `payment_method` | text | `'card'` \| `'ramburs'` |
| `notes` | text NULL | |
| `items` | jsonb | array `{ productId, name, variant, unitPrice, quantity }` |
| `subtotal` | integer | lei |
| `shipping` | integer | lei |
| `total` | integer | lei |
| `status` | enum `order_status` | `noua`\|`in_procesare`\|`expediat`\|`livrat`\|`anulata`, default `noua` |
| `created_at` | timestamptz | default `now()` |

Prețurile din `lib/products.ts` sunt numere întregi de lei (50, 35, 30…), deci `integer`
este suficient.

**Tabel `contact_messages`:**

| coloană | tip | note |
|---|---|---|
| `id` | serial PK | |
| `name` | text | |
| `email` | text | |
| `phone` | text NULL | opțional în formular |
| `subject` | text | `Comandă`\|`Informații produs`\|`Parteneriat`\|`Altele` |
| `message` | text | |
| `read` | boolean | default `false` |
| `created_at` | timestamptz | default `now()` |

### 2. Autentificare — cont din env

Variabile de mediu:

- `ADMIN_EMAIL` — emailul de login al adminului.
- `ADMIN_PASSWORD_HASH` — hash bcrypt al parolei.
- `AUTH_SECRET` — secret aleator pentru semnarea sesiunii JWT.

Flux:

- `/admin/login` (pagină publică): formular email + parolă → **server action** `login`
  verifică `email === ADMIN_EMAIL` și `bcrypt.compare(parola, ADMIN_PASSWORD_HASH)`.
- La succes: emite JWT semnat (`jose`, HS256, exp ~7 zile) și îl pune într-un cookie
  `admin_session` httpOnly + secure + sameSite=lax. Redirect la `/admin`.
- La eșec: mesaj de eroare generic (fără a dezvălui ce a fost greșit).
- **Delogare:** server action care șterge cookie-ul și redirecționează la `/admin/login`.
- Helper `getAdminSession()` / `requireAdmin()` pentru server components & actions.

Runtime: `bcrypt` rulează doar în Node (server action) — **nu** în middleware.
`jose` este compatibil edge/middleware și e folosit doar pentru verificarea JWT-ului deja
emis.

`middleware.ts` (sau echivalentul Next.js 16 — se verifică docs înainte de scriere):
matcher pe `/admin/:path*` exceptând `/admin/login`; verifică cookie-ul `admin_session`;
dacă lipsește/invalid → redirect la `/admin/login`. Layout-ul `/admin` re-verifică sesiunea
server-side (defense in depth).

**Setarea contului:** script `scripts/hash-password.ts` (`npm run hash-password`) care
primește o parolă și tipărește hash-ul bcrypt de pus în `.env.local`.

### 3. UI admin (`app/admin/`)

- `app/admin/layout.tsx` — layout protejat; sidebar **Comenzi · Mesaje · Delogare**;
  refolosește sistemul de design existent (clase `card`, `btn-primary`, culori, fonturi).
- `app/admin/page.tsx` — dashboard: 3 carduri (comenzi noi, comenzi total, mesaje
  necitite) + ultimele comenzi.
- `app/admin/comenzi/page.tsx` — tabel comenzi (id, client, total, status badge, dată),
  rând → detaliu.
- `app/admin/comenzi/[id]/page.tsx` — detaliu comandă (client, adresă, produse, totaluri)
  + dropdown schimbare status (server action `updateOrderStatus`).
- `app/admin/mesaje/page.tsx` — listă mesaje; cele necitite evidențiate; buton
  „marchează citit" (server action `markMessageRead`).
- `app/admin/login/page.tsx` — formular de login (public).

Datele se citesc server-side din DB în Server Components.

### 4. Modificări API (persistență)

- `app/api/checkout/route.ts` — după validare și generarea `orderId`, **inserează comanda
  în DB**. Dacă insert-ul eșuează → răspuns 500 (nu mai confirmăm fals comanda). Mapează
  `items` și `totals` din payload în coloane.
- `app/api/contact/route.ts` — **inserează mesajul în DB** după validare.

### 5. Tooling & config

- `drizzle.config.ts`.
- Scripturi npm: `db:generate`, `db:migrate`, `db:studio`, `hash-password`.
- `.env.example` actualizat cu `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`,
  `AUTH_SECRET`.
- Dependențe noi: `drizzle-orm`, `@neondatabase/serverless`, `bcryptjs`, `jose`;
  dev: `drizzle-kit`.

## Gestionarea erorilor

- Login invalid → eroare generică, fără leak de informație.
- Insert comandă eșuat în checkout → 500; clientul nu primește confirmare falsă.
- Insert mesaj eșuat în contact → 500.
- Pagini admin cu DB indisponibil → stare de eroare lizibilă (nu crash).

## Verificare (fără framework de teste în proiect)

Verificare pragmatică, manuală + câteva unit-tests punctuale dacă se adaugă un runner:

1. **Auth:** login cu credențiale corecte → acces; greșite → eroare; acces `/admin` fără
   sesiune → redirect la login; delogare → redirect la login.
2. **Comenzi:** plasare comandă pe site → apare în `/admin/comenzi` cu datele corecte;
   schimbarea statusului persistă.
3. **Mesaje:** trimitere formular contact → apare în `/admin/mesaje`; „marchează citit"
   persistă.
4. **Sesiune:** semnare + verificare JWT (helper) — unit test opțional.

## Convenții Next.js 16

Conform `AGENTS.md`, se citește documentația din `node_modules/next/dist/docs/` pentru
convenția curentă de middleware/proxy și server actions înainte de implementare (API-uri
pot diferi de versiunile anterioare).
