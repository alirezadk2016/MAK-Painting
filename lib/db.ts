export type BookingStatus = "pending" | "approved" | "cancelled";

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
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
  service?: string;
  message?: string;
}

const KV_SET = "bookings:index";

function key(id: string) {
  return `booking:${id}`;
}

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV() {
  if (!hasKV()) throw new Error("Vercel KV is not configured");
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const booking: Booking = { id, createdAt: new Date().toISOString(), status: "pending", ...data };
  if (hasKV()) {
    const kv = await getKV();
    await kv.set(key(id), booking);
    await kv.zadd(KV_SET, { score: Date.now(), member: id });
  }
  return booking;
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (!hasKV()) return null;
  const kv = await getKV();
  return kv.get<Booking>(key(id));
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const booking = await getBooking(id);
  if (!booking) return null;
  const updated = { ...booking, status };
  if (hasKV()) {
    const kv = await getKV();
    await kv.set(key(id), updated);
  }
  return updated;
}

export async function listBookings(limit = 200): Promise<Booking[]> {
  if (!hasKV()) return [];
  try {
    const kv = await getKV();
    const ids = await kv.zrange<string[]>(KV_SET, 0, limit - 1, { rev: true });
    if (!ids.length) return [];
    const bookings = await Promise.all(ids.map((id) => kv.get<Booking>(key(id))));
    return bookings.filter(Boolean) as Booking[];
  } catch {
    return [];
  }
}
