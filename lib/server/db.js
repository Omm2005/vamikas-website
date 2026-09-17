import { neon } from "@neondatabase/serverless";

// Lazy: the driver throws when DATABASE_URL is absent, and module scope is
// evaluated at build time where the var may not exist yet.
let cached = null;

export const sql = () => {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    cached = neon(url);
  }
  return cached;
};
