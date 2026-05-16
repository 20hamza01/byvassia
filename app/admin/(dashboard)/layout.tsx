import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: middleware also guards this, but never render
  // admin data without a valid session.
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </div>
    </div>
  );
}
