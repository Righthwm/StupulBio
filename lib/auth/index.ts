import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, type AdminSession } from "./session";

export const SESSION_COOKIE = "admin_session";

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
