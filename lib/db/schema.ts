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

/** Romanian display labels for each order status, shown in the admin UI. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  noua: "Nouă",
  in_procesare: "În procesare",
  expediat: "Expediat",
  livrat: "Livrat",
  anulata: "Anulată",
};

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
