// The frontend reads `detail` off a failed response and shows it verbatim
// (see formatError in src/pages/Admin.jsx), so errors say what went wrong.
export const json = (data, { status = 200, headers = {} } = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

export const fail = (status, detail, headers) => json({ detail }, { status, headers });

export const methodNotAllowed = (allowed) =>
  fail(405, `${allowed.join(" or ")} only.`, { allow: allowed.join(", ") });
