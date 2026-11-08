import { NextResponse } from "next/server";
import { briefSchema, briefText } from "@/lib/brief";

export const runtime = "nodejs";

// Best-effort per-instance rate limit. Use a shared store (e.g. Upstash) for strict limits in production.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0] ?? "form")] ??= i.message;
    // a filled honeypot looks like any other failure
    return NextResponse.json({ error: "invalid", fields }, { status: 400 });
  }
  const brief = parsed.data;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  if (!key || !to) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BRIEF_FROM_EMAIL ?? "PixelateBanana <onboarding@resend.dev>",
      to: [to],
      reply_to: brief.email,
      subject: `New brief from ${brief.name.replace(/[\r\n]+/g, " ")}`,
      text: briefText(brief),
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
