"use client";

import { useState } from "react";

type Result = {
  ok: boolean;
  stage?: string;
  error?: string;
  id?: string;
  env?: {
    hasApiKey: boolean;
    apiKeyPrefix: string | null;
    to: string | null;
    from: string;
    usingSharedSender: boolean;
  };
};

export function EmailDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/email-test", { method: "POST" });
      const data = (await res.json()) as Result;
      setResult(data);
    } catch (err) {
      setResult({
        ok: false,
        stage: "network",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="btn"
      >
        {loading ? "Sending…" : "Send test email"}
      </button>

      {result && (
        <div
          className={
            "border p-5 text-sm " +
            (result.ok
              ? "border-ember/50 bg-ember/[0.08] text-ink"
              : "border-red-700/50 bg-red-50 text-ink")
          }
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <>
              <p className="font-semibold uppercase tracking-[0.18em] text-ember">
                Test email sent
              </p>
              <p className="mt-2 text-ink-soft">
                Resend accepted the message. Check {result.env?.to} (including
                spam). Message id:{" "}
                <code className="font-mono text-xs">{result.id}</code>
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold uppercase tracking-[0.18em] text-red-700">
                Test failed — stage: {result.stage}
              </p>
              <p className="mt-2 break-words text-ink">
                {result.error || "Unknown error"}
              </p>
            </>
          )}

          {result.env && (
            <dl className="mt-5 grid grid-cols-[max-content_1fr] gap-x-5 gap-y-1 border-t border-line pt-4 text-xs text-ink-soft">
              <dt>RESEND_API_KEY</dt>
              <dd className="font-mono text-ink">
                {result.env.hasApiKey
                  ? `set (prefix ${result.env.apiKeyPrefix}…)`
                  : "MISSING"}
              </dd>
              <dt>ORDER_NOTIFICATION_EMAIL</dt>
              <dd className="font-mono text-ink">
                {result.env.to || "MISSING"}
              </dd>
              <dt>From</dt>
              <dd className="font-mono text-ink">{result.env.from}</dd>
              {result.env.usingSharedSender && (
                <>
                  <dt>Note</dt>
                  <dd className="text-ember">
                    Using onboarding@resend.dev — Resend will only deliver to
                    your own account-owner address. Verify a domain at
                    resend.com/domains to send from a custom From.
                  </dd>
                </>
              )}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
