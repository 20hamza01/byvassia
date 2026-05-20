import { PasswordForm } from "./PasswordForm";
import { EmailDiagnostics } from "./EmailDiagnostics";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <p className="eyebrow">Settings</p>
      <h1 className="mt-4 font-display text-5xl font-light">Account</h1>
      <p className="mt-4 text-sm text-taupe">
        Rotate the password used to sign in to the atelier.
      </p>

      <div className="mt-12 border border-line bg-ivory-2 p-8">
        <h2 className="font-display text-2xl">Change password</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-taupe">
          Minimum 8 characters
        </p>
        <PasswordForm />
      </div>

      <div className="mt-10 border border-line bg-ivory-2 p-8">
        <h2 className="font-display text-2xl">Order notification emails</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-taupe">
          Diagnostics
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          Sends a real test email via Resend so you can confirm the
          configuration is working. If it fails, the response shows the exact
          Resend error.
        </p>
        <div className="mt-6">
          <EmailDiagnostics />
        </div>
      </div>
    </div>
  );
}
