/**
 * Local dev helper: create the PGlite database at LOCAL_DB_PATH, apply the
 * Drizzle migrations from ./drizzle, and seed a few sample orders and contact
 * messages so the admin panel has data to show. Safe to re-run — seeding is
 * skipped when rows already exist.
 *
 *   LOCAL_DB_PATH=./.pglite npx tsx scripts/db-local-setup.ts
 */
import { config } from "dotenv";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../lib/db/schema";

config({ path: ".env.local" });

const path = process.env.LOCAL_DB_PATH ?? "./.pglite";

async function main() {
  const client = new PGlite(path);
  const db = drizzle(client, { schema });

  console.log(`Applying migrations to PGlite at ${path} ...`);
  await migrate(db, { migrationsFolder: "./drizzle" });

  const existing = await db.select().from(schema.orders).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — skipping sample data.");
    await client.close();
    return;
  }

  console.log("Seeding sample orders and messages ...");
  await db.insert(schema.orders).values([
    {
      id: "SB-1001",
      customerFirstName: "Ana",
      customerLastName: "Popescu",
      customerEmail: "ana.popescu@example.com",
      customerPhone: "0721000111",
      shippingCounty: "Cluj",
      shippingCity: "Cluj-Napoca",
      shippingAddress: "Str. Florilor 12",
      shippingPostalCode: "400001",
      paymentMethod: "card",
      notes: "Livrare după ora 17.",
      items: [
        { productId: "miere-acacia", name: "Miere de salcâm", variant: "500g", unitPrice: 3500, quantity: 2 },
      ],
      subtotal: 7000,
      shipping: 1500,
      total: 8500,
      status: "noua",
    },
    {
      id: "SB-1002",
      customerFirstName: "Mihai",
      customerLastName: "Ionescu",
      customerEmail: "mihai.ionescu@example.com",
      customerPhone: "0732000222",
      shippingCounty: "București",
      shippingCity: "București",
      shippingAddress: "Bd. Unirii 5, ap. 10",
      shippingPostalCode: "030167",
      paymentMethod: "ramburs",
      notes: null,
      items: [
        { productId: "miere-tei", name: "Miere de tei", variant: "1kg", unitPrice: 6000, quantity: 1 },
        { productId: "propolis", name: "Tinctură de propolis", unitPrice: 2500, quantity: 3 },
      ],
      subtotal: 13500,
      shipping: 0,
      total: 13500,
      status: "in_procesare",
    },
  ]);

  await db.insert(schema.contactMessages).values([
    {
      name: "Elena Radu",
      email: "elena.radu@example.com",
      phone: "0740000333",
      subject: "Disponibilitate produs",
      message: "Bună ziua, mai aveți miere de mană în stoc?",
      read: false,
    },
    {
      name: "George Vasile",
      email: "george.vasile@example.com",
      phone: null,
      subject: "Comandă cadou",
      message: "Aș dori un pachet cadou cu mai multe sortimente. Mulțumesc!",
      read: true,
    },
  ]);

  const [orderCount] = await db.select().from(schema.orders);
  console.log(`Done. Seeded orders starting with ${orderCount.id} and 2 messages.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
