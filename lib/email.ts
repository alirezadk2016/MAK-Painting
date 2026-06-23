import { Resend } from "resend";
import type { Booking } from "./db";

// Lazy init — throws at call time (not module load) if API key is missing
function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  return new Resend(process.env.RESEND_API_KEY);
}
const FROM = "MAK Painting Group <no-reply@makvandi.info>";
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "mak.painting.group@gmail.com";

function formatDate(d: string) {
  if (!d) return "To be confirmed";
  try {
    return new Date(d).toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
}

function bookingTable(b: Booking) {
  const rows = [
    ["Suburb / Postcode", b.postcode],
    ["Property Type", b.propertyType],
    ["Scope of Work", b.scope],
    ["Preferred Date", formatDate(b.date)],
    b.rooms ? ["Number of Rooms", b.rooms] : null,
    b.sqm ? ["Area (sqm)", `${b.sqm} m²`] : null,
    b.extras.length ? ["Extras", b.extras.join(", ")] : null,
    b.service ? ["Service", b.service] : null,
    b.message ? ["Notes", b.message] : null,
  ]
    .filter(Boolean)
    .map(
      (r) =>
        `<tr><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;color:#6b7280;font-size:13px;white-space:nowrap">${r![0]}</td><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:13px;font-weight:600">${r![1]}</td></tr>`
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #e8e3db">${rows}</table>`;
}

export async function sendCustomerConfirmation(b: Booking) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking Confirmed — MAK Painting Group</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#1a1a1a;border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center">
          <p style="margin:0 0 4px;color:#c9a24b;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">MAK PAINTING GROUP</p>
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px">Your Booking is Confirmed ✓</h1>
          <p style="margin:12px 0 0;color:#9ca3af;font-size:14px">We've received your request and will be in touch within 1 business day.</p>
        </td></tr>

        <!-- Gold stripe -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#c9a24b,#e8c97a,#c9a24b)"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px">
          <p style="margin:0 0 6px;color:#1a1a1a;font-size:18px;font-weight:700">Hi ${b.name},</p>
          <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7">
            Thank you for choosing MAK Painting Group. We're excited to help transform your space. Your booking details are below — our team will review and confirm your appointment shortly.
          </p>

          <p style="margin:0 0 12px;color:#1a1a1a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Booking Summary</p>
          ${bookingTable(b)}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px">
            <tr>
              <td style="background:#fdf8f0;border-radius:12px;padding:20px 24px;border-left:3px solid #c9a24b">
                <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700">What happens next?</p>
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.7">
                  Hossain will call you within <strong>1 business day</strong> to confirm the appointment details and answer any questions.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#f7f4ef;padding:28px 40px;text-align:center;border-top:1px solid #ede8e0">
          <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Need to make changes? Get in touch:</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto">
            <tr>
              <td style="padding:0 6px">
                <a href="tel:0404000772" style="display:inline-block;background:#1a1a1a;color:#c9a24b;font-weight:700;font-size:13px;text-decoration:none;padding:12px 24px;border-radius:10px">📞 0404 000 772</a>
              </td>
              <td style="padding:0 6px">
                <a href="mailto:mak.painting.group@gmail.com" style="display:inline-block;background:#ffffff;color:#1a1a1a;font-weight:700;font-size:13px;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e0dbd3">✉ Email Us</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Cancellation Policy -->
        <tr><td style="background:#fff8ec;padding:24px 40px;border-top:1px solid #f0e8d8">
          <p style="margin:0 0 8px;color:#92400e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Cancellation Policy</p>
          <p style="margin:0;color:#78350f;font-size:12px;line-height:1.7">
            To cancel or reschedule, please call us at <strong>0404 000 772</strong> at least <strong>48 hours before your appointment</strong>. Cancellations with less than 24 hours' notice may incur a call-out fee to cover travel and preparation costs. We appreciate your understanding.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center">
          <p style="margin:0 0 4px;color:#c9a24b;font-size:14px;font-weight:700">MAK Painting Group</p>
          <p style="margin:0 0 8px;color:#6b7280;font-size:12px">Ferntree Gully, Melbourne VIC 3156 · Dulux Accredited · 7-Year Warranty</p>
          <p style="margin:0;color:#4b5563;font-size:11px">© ${new Date().getFullYear()} MAK Painting Group. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM,
    to: b.email,
    subject: `✓ Booking Confirmed — MAK Painting Group (Ref: ${b.id.slice(0, 8).toUpperCase()})`,
    html,
  });
}

export async function sendOwnerNotification(b: Booking) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Booking — MAK Painting Group</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#c9a24b;border-radius:16px 16px 0 0;padding:28px 40px">
          <p style="margin:0 0 2px;color:#78350f;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">New Booking Alert</p>
          <h1 style="margin:0;color:#1a1a1a;font-size:24px;font-weight:800">New quote request from ${b.name}</h1>
        </td></tr>
        <tr><td style="background:#ffffff;padding:36px 40px">
          <p style="margin:0 0 6px;color:#6b7280;font-size:13px">Submitted: ${new Date(b.createdAt).toLocaleString("en-AU")}</p>
          <p style="margin:0 0 24px;color:#6b7280;font-size:13px">Booking ID: <strong>${b.id}</strong></p>

          <p style="margin:0 0 8px;color:#1a1a1a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Customer Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e3db;border-radius:10px;overflow:hidden;margin-bottom:24px">
            <tr><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;color:#6b7280;font-size:13px;white-space:nowrap">Name</td><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:13px;font-weight:600">${b.name}</td></tr>
            <tr><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;color:#6b7280;font-size:13px">Phone</td><td style="padding:10px 16px;border-bottom:1px solid #f0ede8;font-size:13px"><a href="tel:${b.phone.replace(/\s/g, "")}" style="color:#c9a24b;font-weight:600;text-decoration:none">${b.phone}</a></td></tr>
            <tr><td style="padding:10px 16px;color:#6b7280;font-size:13px">Email</td><td style="padding:10px 16px;font-size:13px"><a href="mailto:${b.email}" style="color:#c9a24b;font-weight:600;text-decoration:none">${b.email}</a></td></tr>
          </table>

          <p style="margin:0 0 8px;color:#1a1a1a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Job Details</p>
          ${bookingTable(b)}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px">
            <tr>
              <td style="padding:0 6px 0 0">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.makvandi.info"}/admin/dashboard" style="display:block;text-align:center;background:#1a1a1a;color:#c9a24b;font-weight:700;font-size:13px;text-decoration:none;padding:14px;border-radius:10px">View in Admin Panel →</a>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:11px">MAK Painting Group · Internal notification · Do not reply to this email</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `🎨 New Booking: ${b.name} — ${b.postcode} (${formatDate(b.date)})`,
    html,
  });
}

export async function sendCancellationEmail(b: Booking) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Booking Cancelled — MAK Painting Group</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#1a1a1a;border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center">
          <p style="margin:0 0 4px;color:#c9a24b;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">MAK PAINTING GROUP</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800">Your Booking Has Been Cancelled</h1>
        </td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#c9a24b,#e8c97a,#c9a24b)"></td></tr>
        <tr><td style="background:#ffffff;padding:40px">
          <p style="margin:0 0 6px;color:#1a1a1a;font-size:18px;font-weight:700">Hi ${b.name},</p>
          <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7">
            We're sorry to let you know that your booking with MAK Painting Group has been cancelled. We apologise for any inconvenience this may cause.
          </p>

          <p style="margin:0 0 12px;color:#1a1a1a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Cancelled Booking</p>
          ${bookingTable(b)}

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px">
            <tr>
              <td style="background:#fdf8f0;border-radius:12px;padding:20px 24px;border-left:3px solid #c9a24b">
                <p style="margin:0 0 4px;color:#1a1a1a;font-size:13px;font-weight:700">Would you like to rebook?</p>
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.7">
                  We'd love to reschedule at a time that works for you. Please call us on <strong>0404 000 772</strong> or visit our website to book a new appointment.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Cancellation Policy reminder -->
        <tr><td style="background:#fff8ec;padding:24px 40px;border-top:1px solid #f0e8d8">
          <p style="margin:0 0 8px;color:#92400e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Our Cancellation Policy</p>
          <p style="margin:0;color:#78350f;font-size:12px;line-height:1.7">
            To avoid a cancellation fee on future bookings, please notify us at least <strong>48 hours before your scheduled appointment</strong> by calling <strong>0404 000 772</strong>. Cancellations within 24 hours of the appointment may incur a call-out fee to cover travel and material preparation.
          </p>
        </td></tr>

        <!-- Contact CTA -->
        <tr><td style="background:#f7f4ef;padding:28px 40px;text-align:center;border-top:1px solid #ede8e0">
          <a href="tel:0404000772" style="display:inline-block;background:#1a1a1a;color:#c9a24b;font-weight:700;font-size:13px;text-decoration:none;padding:14px 32px;border-radius:10px">📞 Call to Rebook: 0404 000 772</a>
        </td></tr>

        <tr><td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center">
          <p style="margin:0 0 4px;color:#c9a24b;font-size:14px;font-weight:700">MAK Painting Group</p>
          <p style="margin:0;color:#6b7280;font-size:12px">Ferntree Gully, Melbourne VIC 3156 · Dulux Accredited · 7-Year Warranty</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM,
    to: b.email,
    subject: `Your Booking Has Been Cancelled — MAK Painting Group`,
    html,
  });
}
