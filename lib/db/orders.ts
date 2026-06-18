import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { orders, ORDER_STATUSES, type Order, type OrderStatus, type NewOrder, type OrderItem } from "./schema";

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
