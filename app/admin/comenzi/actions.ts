"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isOrderStatus, setOrderStatus } from "@/lib/db/orders";

export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !isOrderStatus(status)) return;
  await setOrderStatus(id, status);
  revalidatePath("/admin/comenzi");
  revalidatePath(`/admin/comenzi/${id}`);
}
