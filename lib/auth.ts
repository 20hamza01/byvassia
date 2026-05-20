import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { prisma } from "./prisma";
import { SESSION_COOKIE } from "./session";

export { SESSION_COOKIE };

const ADMIN_PASSWORD_KEY = "admin_password_hash";
const SCRYPT_KEYLEN = 64;
const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_SECRET is missing or too short — set it in .env");
  }
  return new TextEncoder().encode(s);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Server-side guard for Route Handlers / server components. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

async function verifyScryptHash(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (expected.length !== SCRYPT_KEYLEN) return false;
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return timingSafeEqual(derived, expected);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verify a candidate password. Checks the DB-stored hash first (set via
 * the admin settings page); falls back to ADMIN_PASSWORD env when no hash
 * has been stored yet, so a fresh deploy still logs in.
 */
export async function checkPassword(input: string): Promise<boolean> {
  const row = await prisma.setting.findUnique({
    where: { key: ADMIN_PASSWORD_KEY },
  });
  if (row?.value) return verifyScryptHash(input, row.value);

  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}

/** Hash and persist a new admin password, overwriting any prior value. */
export async function setAdminPassword(newPassword: string): Promise<void> {
  const value = await hashPassword(newPassword);
  await prisma.setting.upsert({
    where: { key: ADMIN_PASSWORD_KEY },
    create: { key: ADMIN_PASSWORD_KEY, value },
    update: { value },
  });
}
