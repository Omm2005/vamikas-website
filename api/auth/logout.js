import { clearedCookie } from "../../lib/server/auth.js";
import { json, methodNotAllowed } from "../../lib/server/http.js";

export async function POST() {
  return json({ ok: true }, { headers: { "set-cookie": clearedCookie() } });
}

export const GET = () => methodNotAllowed(["POST"]);
