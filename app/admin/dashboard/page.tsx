import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/db";
import { getSiteConfig, DEFAULT_PRICING, type SiteConfig } from "@/lib/site-config";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

const DEFAULT_GALLERY = [
  { id: 1, title: "Lounge Room — Timber Ceiling",   before: "/lounge-before.jpg",         after: "/lounge-after.jpg" },
  { id: 2, title: "Exterior Render & Repaint",      before: "/exterior-render.jpg",        after: "/exterior-terrace.jpg" },
  { id: 3, title: "Front Entry Door — Gloss Black", before: "/door-exterior-before.jpg",   after: "/door-exterior-after.jpg" },
  { id: 4, title: "Interior Door Respray",          before: "/door-interior-before.jpg",   after: "/door-interior-after.jpg" },
  { id: 5, title: "Bedroom Feature Wall",           before: "/feature-wall-undercoat.jpg", after: "/feature-wall-lilac.jpg" },
  { id: 6, title: "Water Damage Wall Repair",       before: "/wall-damage-before.jpg",     after: "/wall-repair-after.jpg" },
  { id: 7, title: "Ceiling Repair & Patch",         before: "/ceiling-cut-before.jpg",     after: "/ceiling-patch-after.jpg" },
];

export default async function AdminDashboard() {
  await requireAdmin();

  const [bookings, saved] = await Promise.all([listBookings(), getSiteConfig()]);

  const config: SiteConfig = {
    hero:     saved?.hero     ?? "/1.png",
    services: saved?.services ?? {},
    gallery:  saved?.gallery?.length ? saved.gallery : DEFAULT_GALLERY,
    pricing:  saved?.pricing?.length ? saved.pricing : DEFAULT_PRICING,
  };

  return <DashboardClient bookings={bookings} config={config} />;
}
