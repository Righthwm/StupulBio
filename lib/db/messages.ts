import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { contactMessages, type ContactMessage } from "./schema";

export function listMessages(): Promise<ContactMessage[]> {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: number): Promise<void> {
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}

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
