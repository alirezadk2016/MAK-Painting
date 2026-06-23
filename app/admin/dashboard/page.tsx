import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/db";
import { getMediaConfig } from "@/lib/site-config";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [bookings, mediaConfig] = await Promise.all([
    listBookings(),
    getMediaConfig(),
  ]);

  return <DashboardClient bookings={bookings} savedMediaConfig={mediaConfig} />;
}
