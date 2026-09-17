// Node does not read .env.local on its own; these scripts run outside Vite.
import { readFile } from "node:fs/promises";

export const loadEnv = async (file = ".env.local") => {
  const text = await readFile(file, "utf8").catch(() => "");
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    const value = match[2].trim().replace(/^["'](.*)["']$/s, "$1");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
};
