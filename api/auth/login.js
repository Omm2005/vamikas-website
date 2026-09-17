import { sessionCookie, verifyPassword } from "../../lib/server/auth.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail(400, "send an email and a password.");
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!email || !password) return fail(400, "both the email and the password are needed.");

  const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !stored) {
    return fail(500, "no studio key has been set yet — run scripts/set-admin.mjs.");
  }

  // Checked unconditionally so a wrong email and a wrong password take the
  // same time, and neither answer tells you which one was wrong.
  const passwordOk = verifyPassword(password, stored);
  if (email !== adminEmail || !passwordOk) return fail(401, "that email and password do not match.");

  return json({ email: adminEmail }, { headers: { "set-cookie": sessionCookie(adminEmail) } });
}

export const GET = () => methodNotAllowed(["POST"]);
