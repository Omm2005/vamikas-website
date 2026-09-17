// Vite emits dist/app.js + dist/styles.css. This finishes the job:
//  - copies the two files to the repo root, which stays servable by any static server
//  - writes a copy of the document shell into dist for every route, so a host that
//    does no rewriting still resolves deep links
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

// every top-level folder that holds a route shell
const entries = await readdir(root, { withFileTypes: true });
const routes = [];
for (const e of entries) {
  if (!e.isDirectory() || ["dist", "node_modules", "src", "source", "scripts", ".git"].includes(e.name)) continue;
  const shell = path.join(root, e.name, "index.html");
  const exists = await readFile(shell).then(() => true).catch(() => false);
  if (exists) routes.push(e.name);
}

const shell = await readFile(path.join(root, "index.html"), "utf8");

for (const asset of ["app.js", "styles.css"]) {
  await cp(path.join(dist, asset), path.join(root, asset));
}

await writeFile(path.join(dist, "index.html"), shell);
for (const route of routes) {
  await mkdir(path.join(dist, route), { recursive: true });
  await writeFile(path.join(dist, route, "index.html"), shell);
  await writeFile(path.join(root, route, "index.html"), shell);
}

console.log(`postbuild: ${routes.length} route shells → dist/ and root (${routes.join(", ")})`);
