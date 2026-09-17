import { readSession } from "../../lib/server/auth.js";
import { sql } from "../../lib/server/db.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

const KEY = "links";
const SHAPE = ["email", "instagram", "elsewhere"];

export async function GET() {
  const [row] = await sql()`select value from settings where key = ${KEY}`;
  const value = row?.value || {};
  return json(Object.fromEntries(SHAPE.map((k) => [k, String(value[k] || "")])));
}

export async function PUT(request) {
  if (!readSession(request)) return fail(401, "sign in to the studio first.");

  let body;
  try {
    body = await request.json();
  } catch {
    return fail(400, "the links did not arrive as json.");
  }

  const value = Object.fromEntries(SHAPE.map((k) => [k, String(body?.[k] || "").trim()]));
  await sql()`
    insert into settings (key, value) values (${KEY}, ${JSON.stringify(value)}::jsonb)
    on conflict (key) do update set value = excluded.value`;

  return json(value);
}

export const POST = () => methodNotAllowed(["GET", "PUT"]);
