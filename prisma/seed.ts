import { config } from "dotenv";
// Load .env.local so the admin credentials are available whether the seed runs
// via `prisma db seed` (loads .env) or `npm run db:seed` (plain tsx).
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "faguruldeaur@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const PATHS = [
  "/",
  "/magazin",
  "/magazin/miere-salcam",
  "/magazin/miere-tei",
  "/magazin/miere-munte",
  "/despre-noi",
  "/contact",
  "/login",
];
const IPS = ["86.120.1.10", "79.115.2.20", "188.27.3.30", "5.12.4.40", "31.5.6.50", "127.0.0.1"];
const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  if (!ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add ADMIN_EMAIL / ADMIN_PASSWORD to .env.local before seeding."
    );
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", password, name: "Fagurul de Aur" },
    create: { email: ADMIN_EMAIL, name: "Fagurul de Aur", role: "ADMIN", password },
  });

  // Seed 30 days of (anonymous) page visits so the traffic chart is populated.
  await prisma.pageVisit.deleteMany({});
  const visits: {
    path: string;
    method: string;
    ip: string;
    userAgent: string;
    statusCode: number;
    userId: string | null;
    createdAt: Date;
  }[] = [];

  const now = new Date();
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const day = new Date(now);
    day.setDate(day.getDate() - daysAgo);
    const count = 5 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const ts = new Date(day);
      ts.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      visits.push({
        path: pick(PATHS),
        method: "GET",
        ip: pick(IPS),
        userAgent: pick(USER_AGENTS),
        statusCode: 200,
        userId: null,
        createdAt: ts,
      });
    }
  }
  await prisma.pageVisit.createMany({ data: visits });

  console.log(`Seeded admin: ${admin.email} (ADMIN)`);
  console.log(`Seeded ${visits.length} page visits across 30 days.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
