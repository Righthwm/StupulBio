CREATE TYPE "public"."order_status" AS ENUM('noua', 'in_procesare', 'expediat', 'livrat', 'anulata');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_first_name" text NOT NULL,
	"customer_last_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"shipping_county" text NOT NULL,
	"shipping_city" text NOT NULL,
	"shipping_address" text NOT NULL,
	"shipping_postal_code" text NOT NULL,
	"payment_method" text NOT NULL,
	"notes" text,
	"items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"shipping" integer NOT NULL,
	"total" integer NOT NULL,
	"status" "order_status" DEFAULT 'noua' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
