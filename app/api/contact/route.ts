import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/db";
import { sendCustomerConfirmation, sendOwnerNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      postcode, propertyType, scope, rooms, sqm, extras,
      date, name, phone, email,
      // legacy contact form fields
      firstName, lastName, suburb, service, message,
    } = body;

    // Support both QuoteWizard and ContactSection submissions
    const resolvedName = name || `${firstName ?? ""} ${lastName ?? ""}`.trim();
    const resolvedEmail = email ?? "";
    const resolvedPhone = phone ?? "";

    if (!resolvedEmail || !resolvedName) {
      return NextResponse.json({ ok: false, error: "Name and email are required" }, { status: 400 });
    }

    const booking = await createBooking({
      postcode: postcode ?? suburb ?? "",
      propertyType: propertyType ?? "",
      scope: scope ?? "",
      rooms: rooms ?? "",
      sqm: sqm ?? "",
      extras: extras ?? [],
      date: date ?? "",
      name: resolvedName,
      phone: resolvedPhone,
      email: resolvedEmail,
      service,
      message,
    });

    // Fire emails in parallel (don't fail the request if email is misconfigured)
    if (process.env.RESEND_API_KEY) {
      await Promise.allSettled([
        resolvedEmail ? sendCustomerConfirmation(booking) : Promise.resolve(),
        sendOwnerNotification(booking),
      ]);
    }

    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    console.error("[contact/route] error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
