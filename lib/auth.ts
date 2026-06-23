import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function requireAdmin() {
  const authed = await getAdminSession();
  if (!authed) redirect("/admin");
}
