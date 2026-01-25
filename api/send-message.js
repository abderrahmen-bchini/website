import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limit (per IP)
const RATE_LIMIT = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const lastRequest = RATE_LIMIT.get(ip) || 0;

  if (now - lastRequest < RATE_LIMIT_WINDOW) {
    return true;
  }

  RATE_LIMIT.set(ip, now);
  return false;
}

// Basic HTML escaping to prevent injection
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  // Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Environment safety check
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Get client IP (Vercel-safe)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  // Rate limiting
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { message } = req.body;

  // Validation
  if (
    !message ||
    typeof message !== "string" ||
    message.trim().length < 5 ||
    message.length > 2000
  ) {
    return res.status(400).json({ error: "Invalid message" });
  }

  const safeMessage = escapeHtml(message.trim());

  try {
    await resend.emails.send({
      from: "Website <onboarding@resend.dev>",
      to: "abderrahmen.bchini24@gmail.com",
      subject: "New Website Message",
      html: `
        <h3>New message from your website</h3>
        <p>${safeMessage}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Email failed" });
  }
}
