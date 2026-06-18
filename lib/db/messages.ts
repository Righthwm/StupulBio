import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { contactMessages, type ContactMessage } from "./schema";

export function listMessages(): Promise<ContactMessage[]> {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: number): Promise<void> {
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}
