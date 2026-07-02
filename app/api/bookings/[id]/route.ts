import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBookingStatus } from "@/lib/db";
import { sendCancellationEmail } from "@/lib/email";
import { cookies } from "next/headers";

async function isAuthed() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();

  if (status !== "approved" && status !== "cancelled") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await updateBookingStatus(id, status);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "cancelled" && booking.email && process.env.RESEND_API_KEY) {
    await sendCancellationEmail(booking).catch(console.error);
  }

  return NextResponse.json({ booking });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ booking });
}
