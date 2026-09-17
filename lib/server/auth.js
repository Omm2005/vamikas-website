import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "vamika_session";
const MAX_AGE = 60 * 60 * 24 * 14; // two weeks

const b64url = (buf) => Buffer.from(buf).toString("base64url");

const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
};

const signature = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");

// scrypt, stored as "salt:hash" hex. Written by scripts/set-admin.mjs.
export const hashPassword = (password, salt = randomBytes(16).toString("hex")) =>
  `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;

export const verifyPassword = (password, stored) => {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

export const createSession = (email) => {
  const payload = b64url(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 }));
  return `${payload}.${signature(payload)}`;
};

export const readSession = (request) => {
  const raw = request.headers.get("cookie") || "";
  const found = raw.split(";").map((c) => c.trim().split("="));
  const token = found.find(([name]) => name === COOKIE)?.[1];
  if (!token) return null;

  const [payload, provided] = token.split(".");
  if (!payload || !provided) return null;

  // Compare as buffers of equal length; timingSafeEqual throws otherwise.
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!session?.exp || session.exp < Date.now()) return null;
    return { email: session.email };
  } catch {
    return null;
  }
};

// Same-origin now that the API lives beside the site, so Lax is enough and
// still blocks the cross-site POSTs SameSite exists to stop.
const cookie = (value, maxAge) =>
  [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    process.env.VERCEL_ENV === "development" ? null : "Secure",
  ]
    .filter(Boolean)
    .join("; ");

export const sessionCookie = (email) => cookie(createSession(email), MAX_AGE);
export const clearedCookie = () => cookie("", 0);
