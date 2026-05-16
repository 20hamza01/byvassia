"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/format";

export function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function update(next: string) {
    setStatus(next);
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-taupe">
        Order status
      </label>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => update(e.target.value)}
        className="field mt-3"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <p className="mt-2 h-4 text-xs text-taupe">
        {saving ? "Saving…" : saved ? "Saved" : ""}
      </p>
    </div>
  );
}
