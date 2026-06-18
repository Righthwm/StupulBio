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
