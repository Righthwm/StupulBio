"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { markMessageRead } from "@/lib/db/messages";

export async function markRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await markMessageRead(id);
  revalidatePath("/admin/mesaje");
}
