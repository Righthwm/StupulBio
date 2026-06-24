# Autentificare & Panou Admin

Sistem de autentificare (login + register + rute protejate) cu rol CLIENT/ADMIN,
zonă de client (profil + istoric comenzi) și panou de admin (comenzi, mesaje,
trafic). Stack: **NextAuth v5 (Auth.js)** + **Prisma/SQLite** + **bcryptjs** +
**Recharts**.

## Variabile de mediu (`.env.local`)

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<string aleator>"   # generează cu: openssl rand -base64 32
AUTH_SECRET="<același string>"        # NextAuth v5 citește AUTH_SECRET

# Contul de admin creat de seed (parola NU e hardcodată în cod):
ADMIN_EMAIL="stupulbio@outlook.com"
ADMIN_PASSWORD="<parolă admin>"
```

> Notă: Prisma CLI citește `.env` (nu `.env.local`), de aceea `DATABASE_URL`
> există și în `.env`. Restul (NextAuth, admin, Resend) stau în `.env.local` —
> seed-ul încarcă `.env.local` explicit pentru a citi `ADMIN_PASSWORD`.

## Migrații

```bash
# aplică schema în DB (creează prisma/dev.db) + generează Prisma Client
npx prisma migrate dev

# după ce modifici prisma/schema.prisma:
npx prisma migrate dev --name <descriere>

# regenerează doar clientul:
npx prisma generate
```

## Seed

```bash
npx prisma db seed
# sau:  npm run db:seed
```

Creează (sau actualizează) **contul de admin** din `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(parola e citită din `.env.local`, niciodată hardcodată) și 30 de zile de vizite
(`PageVisit`) ca să fie populat graficul de trafic.

Conturile de **client** se creează prin pagina `/register`. Pentru a promova un
client la ADMIN, folosește tab-ul **Clienți** din panou (`/admin/clienti`).

## Rute

| Rută               | Acces        | Descriere                                   |
|--------------------|--------------|---------------------------------------------|
| `/register`        | public       | creare cont client                          |
| `/login`           | public       | autentificare                               |
| `/dashboard`       | autentificat | profil + istoric comenzi                    |
| `/admin`           | doar ADMIN   | trafic (carduri, grafic 30 zile, jurnal)    |
| `/admin/comenzi`   | doar ADMIN   | lista comenzilor                            |
| `/admin/mesaje`    | doar ADMIN   | mesajele de contact                         |
| `/admin/clienti`   | doar ADMIN   | lista conturilor + schimbare rol            |
| `/api/admin/traffic` | doar ADMIN | date agregate de trafic (JSON)              |

Protecția se face în `proxy.ts` (redirect la `/login`; `/admin/*` cere ADMIN).

## Migrare la PostgreSQL (producție)

SQLite e un fișier local — efemer pe hosturi serverless (Vercel). Pentru deploy:

1. În `prisma/schema.prisma` schimbă `provider = "sqlite"` → `provider = "postgresql"`.
2. Pune `DATABASE_URL` = connection string Neon/Postgres.
3. `npx prisma migrate deploy`.
4. Cu Postgres poți înlocui câmpurile `role`/`status` (String) cu enum-uri Prisma,
   iar `Order.items` (String JSON) cu tip `Json`.

## GDPR

Jurnalul de trafic stochează **IP-ul** fiecărui vizitator (date cu caracter
personal). Înainte de producție: adaugă mențiunea în politica de confidențialitate
(`/gdpr`), stabilește un temei legal și o perioadă de retenție (ștergere
periodică a `PageVisit` mai vechi de X zile).
