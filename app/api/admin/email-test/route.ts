import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isAdmin } from "@/lib/auth";

/**
 * Diagnostic: report email-env health and send a real test message via
 * Resend, returning the exact API error if it fails. Lets the shop owner
 * troubleshoot order-notification delivery without needing Vercel logs.
 */
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  const from =
    process.env.ORDER_NOTIFICATION_FROM ||
    "VASSIA Orders <onboarding@resend.dev>";

  const env = {
    hasApiKey: Boolean(apiKey),
    apiKeyPrefix: apiKey ? apiKey.slice(0, 4) : null,
    to: to || null,
    from,
    usingSharedSender: from.includes("onboarding@resend.dev"),
  };

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        env,
        stage: "config",
        error: "RESEND_API_KEY is not set on this environment.",
      },
      { status: 200 },
    );
  }
  if (!to) {
    return NextResponse.json(
      {
        ok: false,
        env,
        stage: "config",
        error: "ORDER_NOTIFICATION_EMAIL is not set on this environment.",
      },
      { status: 200 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: "VASSIA — Email diagnostics test",
      text:
        "This is a diagnostics test sent from the VASSIA admin.\n\n" +
        "If you received this, order-notification delivery is working.\n\n" +
        `From: ${from}\nTo:   ${to}\n`,
      html: `<p>This is a <strong>diagnostics test</strong> sent from the VASSIA admin.</p>
             <p>If you received this, order-notification delivery is working.</p>
             <p><small>From: ${from}<br/>To: ${to}</small></p>`,
    });
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          env,
          stage: "resend",
          error: error.message || "Unknown Resend error",
          details: error,
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true, env, id: data?.id, stage: "sent" });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        env,
        stage: "exception",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 200 },
    );
  }
}
