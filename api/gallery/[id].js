import { del } from "@vercel/blob";
import { readSession } from "../../lib/server/auth.js";
import { sql } from "../../lib/server/db.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

const idFrom = (request) => decodeURIComponent(new URL(request.url).pathname.split("/").pop() || "");

export async function DELETE(request) {
  if (!readSession(request)) return fail(401, "sign in to the studio first.");

  const id = idFrom(request);
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400, "that is not a piece id.");

  const [item] = await sql()`delete from gallery_items where id = ${id} returning url`;
  if (!item) return fail(404, "that piece is already gone.");

  // The row is the only reference to the blob, so drop the file too rather
  // than paying to store something nothing can reach.
  try {
    await del(item.url);
  } catch {
    // The row is gone either way; a stranded blob is not worth failing on.
  }

  return json({ ok: true });
}

export const GET = () => methodNotAllowed(["DELETE"]);
