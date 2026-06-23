import { kv } from "@vercel/kv";

export type BookingStatus = "pending" | "approved" | "cancelled";

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  // from QuoteWizard
  postcode: string;
  propertyType: string;
  scope: string;
  rooms: string;
  sqm: string;
  extras: string[];
  date: string;
  name: string;
  phone: string;
  email: string;
  // optional extras from contact form
  service?: string;
  message?: string;
}

const KV_SET = "bookings:index";

function key(id: string) {
  return `booking:${id}`;
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const booking: Booking = { id, createdAt: new Date().toISOString(), status: "pending", ...data };
  await kv.set(key(id), booking);
  await kv.zadd(KV_SET, { score: Date.now(), member: id });
  return booking;
}

export async function getBooking(id: string): Promise<Booking | null> {
  return kv.get<Booking>(key(id));
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const booking = await getBooking(id);
  if (!booking) return null;
  const updated = { ...booking, status };
  await kv.set(key(id), updated);
  return updated;
}

export async function listBookings(limit = 200): Promise<Booking[]> {
  const ids = await kv.zrange<string[]>(KV_SET, 0, limit - 1, { rev: true });
  if (!ids.length) return [];
  const bookings = await Promise.all(ids.map((id) => kv.get<Booking>(key(id))));
  return bookings.filter(Boolean) as Booking[];
}
