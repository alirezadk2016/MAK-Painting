import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, suburb, service, message } = body;

    // Log to server (visible in Vercel Function logs)
    console.log("[Contact Form Submission]", {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      suburb,
      service,
      messageLength: message?.length,
      timestamp: new Date().toISOString(),
    });

    // Forward to Formspree if configured, otherwise just accept the submission
    const formspreeId = process.env.FORMSPREE_ID;
    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, suburb, service, message }),
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: "Failed to forward" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
