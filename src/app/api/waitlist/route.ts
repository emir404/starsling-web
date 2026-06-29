/**
 * Waitlist capture — adds the submitted email to a Resend audience.
 *
 * Requires two environment variables (see .env.example):
 *   RESEND_API_KEY      — a Resend API key
 *   RESEND_AUDIENCE_ID  — the audience to add contacts to
 *
 * POST handlers are never cached, so this always runs at request time.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof payload === "object" && payload !== null && "email" in payload
      ? String((payload as { email: unknown }).email ?? "").trim()
      : "";

  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error(
      "[waitlist] RESEND_API_KEY or RESEND_AUDIENCE_ID is not set — cannot capture signups.",
    );
    return Response.json(
      { ok: false, error: "The waitlist isn’t available right now. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase(), unsubscribed: false }),
      },
    );

    if (res.ok) {
      return Response.json({ ok: true });
    }

    // Resend returns 409/422 when the contact already exists — that's still a
    // successful "you're on the list" from the visitor's point of view.
    if (res.status === 409 || res.status === 422) {
      return Response.json({ ok: true, alreadyJoined: true });
    }

    const detail = await res.text().catch(() => "");
    console.error(`[waitlist] Resend responded ${res.status}: ${detail}`);
    return Response.json(
      { ok: false, error: "We couldn’t add you just now. Please try again." },
      { status: 502 },
    );
  } catch (err) {
    console.error("[waitlist] Unexpected error contacting Resend:", err);
    return Response.json(
      { ok: false, error: "We couldn’t add you just now. Please try again." },
      { status: 502 },
    );
  }
}
