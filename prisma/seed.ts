import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PATHS = [
  "/",
  "/magazin",
  "/magazin/miere-salcam",
  "/magazin/miere-tei",
  "/magazin/miere-munte",
  "/despre-noi",
  "/contact",
  "/login",
  "/dashboard",
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
  const [adminPass, clientPass] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("client123", 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.ro" },
    update: { password: adminPass, role: "ADMIN" },
    create: { email: "admin@demo.ro", name: "Admin Demo", password: adminPass, role: "ADMIN" },
  });
  const client = await prisma.user.upsert({
    where: { email: "client@demo.ro" },
    update: { password: clientPass, role: "CLIENT" },
    create: { email: "client@demo.ro", name: "Client Demo", password: clientPass, role: "CLIENT" },
  });

  // Reset and seed 30 days of page visits so the chart is populated immediately.
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
        userId: Math.random() < 0.1 ? client.id : null,
        createdAt: ts,
      });
    }
  }
  await prisma.pageVisit.createMany({ data: visits });

  console.log(`Seeded users: ${admin.email} (ADMIN), ${client.email} (CLIENT)`);
  console.log(`Seeded ${visits.length} page visits across 30 days.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
