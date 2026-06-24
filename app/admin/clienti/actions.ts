"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Promote/demote a user. Admin-only, and you can't change your own role
 *  (prevents locking yourself out of the admin panel). */
export async function setUserRole(userId: string, role: "ADMIN" | "CLIENT") {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  if (session.user.id === userId) {
    return; // ignore self-changes
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/clienti");
}
