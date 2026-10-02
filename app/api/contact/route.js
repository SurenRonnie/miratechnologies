// POST /api/contact
// Delivery order: CONTACT_WEBHOOK_URL (Slack/Zapier/Make etc.), then Resend
// (RESEND_API_KEY + CONTACT_TO_EMAIL), otherwise the enquiry is logged on the server.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validate(body) {
  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    company: clean(body.company, 160),
    service: clean(body.service, 80),
    budget: clean(body.budget, 80),
    message: clean(body.message, 5000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "That email doesn't look right.";
  if (data.message.length < 10) errors.message = "A few more words about the project, please.";
  return { data, errors };
}

async function deliver(data) {
  const meta = [
    data.company && `Company: ${data.company}`,
    data.service && `Service: ${data.service}`,
    data.budget && `Budget: ${data.budget}`,
  ].filter(Boolean);
  const text = [`New enquiry from ${data.name} <${data.email}>`, ...meta, "", data.message].join("\n");

  if (process.env.CONTACT_WEBHOOK_URL) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, ...data }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return;
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Mira Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `New project enquiry: ${data.name}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return;
  }

  console.info("[contact] No delivery configured. Enquiry:\n" + text);
}

export async function POST(request) {
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many messages. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (body.website) return Response.json({ ok: true });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    await deliver(data);
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return Response.json(
      { ok: false, error: "We couldn't send that right now. Email us directly instead." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
