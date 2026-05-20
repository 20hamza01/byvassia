"use client";

import { useState } from "react";

const MIN_LENGTH = 8;

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < MIN_LENGTH) {
      setError(`New password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must differ from the current one.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not update password.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-7">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-taupe">
          Current password
        </span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="field mt-2"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-taupe">
          New password
        </span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          minLength={MIN_LENGTH}
          required
          className="field mt-2"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-taupe">
          Confirm new password
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          minLength={MIN_LENGTH}
          required
          className="field mt-2"
        />
      </label>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p
          className="text-sm uppercase tracking-[0.18em] text-ember"
          role="status"
        >
          Password updated.
        </p>
      )}

      <button type="submit" className="btn mt-2 self-start" disabled={loading}>
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
