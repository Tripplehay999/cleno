import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const CLENO_EMAIL = "hello@cleno.ca";
const FROM_EMAIL = "Cleno <bookings@cleno.ca>";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, service, serviceName, size, date, time, notes } = body;

  if (!name || !email || !phone || !service || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = name.split(" ")[0];

  try {
    // 1. Confirmation email to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your Cleno booking is confirmed — ${formattedDate}`,
      html: customerEmailHtml({ firstName, serviceName, size, formattedDate, time, notes }),
    });

    // 2. Internal notification to Cleno team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CLENO_EMAIL,
      subject: `New booking: ${name} — ${serviceName} on ${formattedDate}`,
      html: internalEmailHtml({ name, email, phone, serviceName, size, formattedDate, time, notes }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function customerEmailHtml({
  firstName, serviceName, size, formattedDate, time, notes,
}: {
  firstName: string;
  serviceName: string;
  size: string;
  formattedDate: string;
  time: string;
  notes: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F6F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F2;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:#1D9E75;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">cleno</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a18;letter-spacing:-0.3px;">You're booked, ${firstName}!</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">We'll take care of the rest. Here's your booking summary:</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F2;border-radius:12px;overflow:hidden;margin-bottom:28px;">
              ${bookingRow("Service", serviceName)}
              ${bookingRow("Space", size)}
              ${bookingRow("Date", formattedDate)}
              ${bookingRow("Time", time)}
              ${notes ? bookingRow("Notes", notes) : ""}
            </table>

            <div style="background:#E1F5EE;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0;font-size:13px;color:#0F6E56;line-height:1.6;">
                ✓ If anything's not right after the clean, we'll fix it — no questions asked.
              </p>
            </div>

            <p style="margin:0 0 6px;font-size:13px;color:#9CA3AF;">Questions? Just reply to this email or reach us at <a href="mailto:hello@cleno.ca" style="color:#1D9E75;text-decoration:none;">hello@cleno.ca</a></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #F3F4F6;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">© 2025 Cleno · Toronto, ON</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function internalEmailHtml({
  name, email, phone, serviceName, size, formattedDate, time, notes,
}: {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  size: string;
  formattedDate: string;
  time: string;
  notes: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F6F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F2;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#1a1a18;padding:24px 32px;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#1D9E75;text-transform:uppercase;letter-spacing:.08em;">New Booking</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:600;color:#ffffff;">${name}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F2;border-radius:12px;overflow:hidden;margin-bottom:20px;">
              ${bookingRow("Service", serviceName)}
              ${bookingRow("Space", size)}
              ${bookingRow("Date", formattedDate)}
              ${bookingRow("Time", time)}
              ${bookingRow("Name", name)}
              ${bookingRow("Email", email)}
              ${bookingRow("Phone", phone)}
              ${notes ? bookingRow("Notes", notes) : ""}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function bookingRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #ffffff;">
      <span style="font-size:12px;color:#9CA3AF;">${label}</span>
      <span style="font-size:13px;font-weight:500;color:#1a1a18;float:right;">${value}</span>
    </td>
  </tr>`;
}
