import { NextResponse } from "next/server";
import { checkPassword, isAdmin, setAdminPassword } from "@/lib/auth";

const MIN_LENGTH = 8;

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let currentPassword = "";
  let newPassword = "";
  try {
    const body = await req.json();
    currentPassword = String(body?.currentPassword ?? "");
    newPassword = String(body?.newPassword ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (newPassword.length < MIN_LENGTH) {
    return NextResponse.json(
      { error: `New password must be at least ${MIN_LENGTH} characters.` },
      { status: 400 },
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "New password must differ from the current one." },
      { status: 400 },
    );
  }

  if (!(await checkPassword(currentPassword))) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 },
    );
  }

  await setAdminPassword(newPassword);
  return NextResponse.json({ ok: true });
}
