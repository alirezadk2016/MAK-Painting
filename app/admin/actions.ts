"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateBookingStatus, type BookingStatus } from "@/lib/db";
import { setSiteConfig, type SiteConfig } from "@/lib/site-config";
import { sendCancellationEmail } from "@/lib/email";

export async function loginAction(_prev: { error: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password !== process.env.ADMIN_SECRET) {
    return { error: "Incorrect password. Please try again." };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_token", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin");
}

export async function updateBookingAction(id: string, status: BookingStatus) {
  await requireAdmin();
  const booking = await updateBookingStatus(id, status);
  if (!booking) throw new Error("Booking not found");
  if (status === "cancelled" && booking.email && process.env.RESEND_API_KEY) {
    await sendCancellationEmail(booking).catch(console.error);
  }
  // Do NOT revalidate /admin/dashboard — it's force-dynamic (always fresh)
  // and revalidating an auth-protected page from a server action causes a
  // "Server Components render error" because the re-render runs without cookies.
  return booking;
}

export async function saveSiteConfigAction(config: SiteConfig) {
  await requireAdmin();
  await setSiteConfig(config);
  // Only revalidate public-facing pages, never the protected admin route.
  revalidatePath("/en", "page");
  revalidatePath("/fa", "page");
  revalidatePath("/en/gallery", "page");
  revalidatePath("/fa/gallery", "page");
}

export async function uploadImageAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) throw new Error("Only JPEG, PNG, WebP or GIF allowed");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { url: `/placeholder-${Date.now()}.jpg`, dev: true };
  }
  const { put } = await import("@vercel/blob");
  const blob = await put(`media/${Date.now()}-${file.name}`, file, { access: "public" });
  return { url: blob.url };
}
