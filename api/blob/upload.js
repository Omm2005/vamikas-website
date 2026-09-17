import { handleUpload } from "@vercel/blob/client";
import { readSession } from "../../lib/server/auth.js";
import { fail, json, methodNotAllowed } from "../../lib/server/http.js";

// Hands the browser a short-lived token so the photo goes straight to Blob.
// Only a signed-in studio session can get one.
export async function POST(request) {
  if (!readSession(request)) return fail(401, "sign in to the studio first.");

  let body;
  try {
    body = await request.json();
  } catch {
    return fail(400, "the upload request did not arrive as json.");
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
        addRandomSuffix: true,
        maximumSizeInBytes: 25 * 1024 * 1024,
      }),
      // The row is written by POST /api/gallery once the browser confirms the
      // upload, so nothing is needed here — and that also keeps local dev
      // working, where Blob cannot call back into localhost.
      onUploadCompleted: async () => {},
    });
    return json(result);
  } catch (error) {
    return fail(400, error?.message || "the photo could not be uploaded.");
  }
}

export const GET = () => methodNotAllowed(["POST"]);
