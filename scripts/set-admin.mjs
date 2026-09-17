// Sets (or rotates) the studio login.
//
//   node scripts/set-admin.mjs <email> [password]
//
// The password itself is never stored — only a scrypt hash of it, as the
// ADMIN_PASSWORD_HASH environment variable on the Vercel project. Omit the
// password and a strong one is generated and printed once.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../lib/server/auth.js";

const ENVIRONMENTS = ["production", "preview", "development"];

const [email, given] = process.argv.slice(2);
if (!email || !email.includes("@")) {
  console.error("usage: node scripts/set-admin.mjs <email> [password]");
  process.exit(1);
}

const password = given || randomBytes(12).toString("base64url");

const run = (args) =>
  new Promise((resolve) => {
    const child = spawn("vercel", args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err += d));
    child.stdout.on("data", () => {});
    child.on("close", (code) => resolve({ code, err }));
  });

// `--value` rather than stdin: piping the value in gets eaten by the prompts
// `env add` asks for some targets, which silently stores the wrong thing.
const set = async (name, value) => {
  for (const environment of ENVIRONMENTS) {
    const { code, err } = await run([
      "env", "add", name, environment,
      "--value", value, "--sensitive", "--force", "--yes",
    ]);
    if (code !== 0) {
      console.error(`failed to set ${name} for ${environment}:\n${err}`);
      process.exit(1);
    }
  }
  console.log(`  ${name} → ${ENVIRONMENTS.join(", ")}`);
};

console.log("setting the studio login…");
await set("ADMIN_EMAIL", email.trim().toLowerCase());
await set("ADMIN_PASSWORD_HASH", hashPassword(password));

// One secret signs the session cookies; rotating it signs everyone out.
if (!process.env.KEEP_SESSION_SECRET) {
  await set("SESSION_SECRET", randomBytes(32).toString("hex"));
}

console.log("\ndone. the studio login is now:");
console.log(`  email:    ${email.trim().toLowerCase()}`);
console.log(`  password: ${password}`);
console.log("\nrun `vercel env pull .env.local` for local dev, and redeploy for production.");
