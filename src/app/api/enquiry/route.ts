const recipient = "enquiries@curabelcomplexcare.co.uk";
const types = ["Family enquiry", "Professional referral", "Careers enquiry"];
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const reply = (error: string, status: number) => Response.json({ error }, { status });
  const origin = request.headers.get("origin");
  try {
    const source = new URL(origin ?? "");
    if (!["https:", "http:"].includes(source.protocol) || source.host !== request.headers.get("host")) return reply("Request not allowed.", 403);
  } catch { return reply("Request not allowed.", 403); }
  if (!request.headers.get("content-type")?.includes("application/json")) return reply("Invalid request format.", 415);
  let raw: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply("Empty request.", 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 12000) { await reader.cancel(); return reply("Message is too large.", 413); } chunks.push(value); }
    raw = Buffer.concat(chunks).toString("utf8");
  } catch { return reply("Unable to read request.", 400); }
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw); if (!data || typeof data !== "object" || Array.isArray(data)) throw Error(); } catch { return reply("Invalid request.", 400); }
  const field = (name: string) => typeof data[name] === "string" ? (data[name] as string).trim() : "";
  const name = field("name"), email = field("email"), telephone = field("telephone"), message = field("message"), type = field("type");
  if (field("website")) return reply("Unable to submit enquiry.", 400);
  if (!name || name.length > 100 || /[\r\n]/.test(name) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || email.length > 254 || telephone.length > 30 || /[\r\n]/.test(telephone) || message.length < 10 || message.length > 2000 || !types.includes(type) || data.consent !== true) return reply("Please check the required fields and consent before submitting.", 400);
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM_EMAIL;
  if (process.env.ENQUIRIES_ENABLED !== "true" || !key || !from || /[\r\n]/.test(from)) return reply("Online enquiries are temporarily unavailable. Please email enquiries@curabelcomplexcare.co.uk or call 0333 880 5696.", 503);
  const id = field("submissionId");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return reply("Invalid submission reference.", 400);
  const rows = [["Name", name], ["Email", email], ["Telephone", telephone || "Not provided"], ["Enquiry type", type], ["Message", message]];
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `curabel-enquiry/${id}` },
      body: JSON.stringify({ from, to: [recipient], reply_to: email, subject: `Curabel website | ${type} | ${name}`, text: `New Curabel website enquiry\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\nReference: ${id}`, html: `<div style="font-family:Arial,sans-serif;color:#142b45;max-width:640px"><h1 style="color:#07509f;font-size:24px">New website enquiry</h1><p>A ${escape(type.toLowerCase())} was submitted through the Curabel website.</p><table style="border-collapse:collapse;width:100%">${rows.map(([label, value]) => `<tr><th style="padding:12px;border-bottom:1px solid #e1eaf2;text-align:left;vertical-align:top">${label}</th><td style="padding:12px;border-bottom:1px solid #e1eaf2;white-space:pre-wrap;overflow-wrap:anywhere">${escape(value)}</td></tr>`).join("")}</table><p style="font-size:12px">Reference: ${id}</p><p>Reply to this email to contact the enquirer.</p></div>` })
    });
    const result = await response.json();
    if (!response.ok || !result.id) return reply("We could not send your enquiry. Please try again or email enquiries@curabelcomplexcare.co.uk.", 502);
    return Response.json({ success: true });
  } catch { return reply("We could not confirm your enquiry was sent. Please retry without changing your details, or contact us by email.", 502); }
}
