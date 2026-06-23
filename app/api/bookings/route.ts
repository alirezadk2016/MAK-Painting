import { NextRequest, NextResponse } from "next/server";
import { listBookings } from "@/lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET(_req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}
