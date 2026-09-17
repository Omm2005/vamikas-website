import { readSession } from "../../lib/server/auth.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

export async function GET(request) {
  const session = readSession(request);
  if (!session) return fail(401, "not signed in.");
  return json({ email: session.email });
}

export const POST = () => methodNotAllowed(["GET"]);
