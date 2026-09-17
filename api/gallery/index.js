import { readSession } from "../../lib/server/auth.js";
import { sql } from "../../lib/server/db.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

const CATEGORIES = new Set([
  "garments", "sketchbook", "textiles", "art", "experiments", "editorial", "process",
]);

export async function GET(request) {
  const category = new URL(request.url).searchParams.get("category");
  const db = sql();

  // The archive filters by category; the site's slot photos fetch everything.
  const items =
    category && category !== "all"
      ? await db`select * from gallery_items
                 where is_deleted = false and category = ${category}
                 order by created_at desc`
      : await db`select * from gallery_items
                 where is_deleted = false
                 order by created_at desc`;

  return json({ items });
}

// The file itself goes browser → Blob directly (a function body caps at
// 4.5 MB, and these are full-size photos), so this only records the result.
export async function POST(request) {
  if (!readSession(request)) return fail(401, "sign in to the studio first.");

  let body;
  try {
    body = await request.json();
  } catch {
    return fail(400, "the upload details did not arrive as json.");
  }

  const title = String(body?.title || "").trim();
  const url = String(body?.url || "").trim();
  const storagePath = String(body?.storage_path || "").trim();
  if (!title) return fail(400, "a title is needed.");
  if (!url || !storagePath) return fail(400, "the photo did not finish uploading.");

  const category = CATEGORIES.has(body?.category) ? body.category : "garments";
  const text = (value) => String(value ?? "").trim();

  const [item] = await sql()`
    insert into gallery_items (title, category, medium, year, description, diary, url, storage_path)
    values (${title}, ${category}, ${text(body.medium)}, ${text(body.year)},
            ${text(body.description)}, ${text(body.diary)}, ${url}, ${storagePath})
    returning *`;

  return json(item, { status: 201 });
}

export const PUT = () => methodNotAllowed(["GET", "POST"]);
