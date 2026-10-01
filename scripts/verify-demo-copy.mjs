import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

// Product fixtures must stay fictional. Reference images/specification text are
// intentionally excluded because they preserve source provenance and are not UI copy.
const roots = ["src", "stories", "packages/infisson_ui/src", "tests/consumer-smoke", "index.html"];
const forbidden = [
  "City of Austin",
  "Austin Energy",
  "Austin, TX",
  "Sunridge Solar",
  "1254 Oak Street",
  "Oak Street",
  "John Carter",
  "Elena Ruiz",
  "Marcus Webb",
  "Tasha Brooks",
  "Round Rock",
  "Houston Solar",
  "Denver Solar",
  "Permitly",
];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".html", ".css", ".md", ".json", ".svg"]);
const files = [];
const ignoredDirectories = new Set(["node_modules", ".git", ".standalone-build", ".preview-build", ".storybook-static", "dist"]);
function collect(path) {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory() && ignoredDirectories.has(path.split(/[\\/]/).pop())) return;
  if (stat.isFile()) {
    if (extensions.has(path.slice(path.lastIndexOf(".")))) files.push(path);
    return;
  }
  for (const entry of readdirSync(path)) collect(join(path, entry));
}
for (const root of roots) collect(resolve(root));
const findings = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const term of forbidden) {
    if (text.toLocaleLowerCase().includes(term.toLocaleLowerCase())) findings.push(`${file}: ${term}`);
  }
}
if (findings.length) {
  console.error("Fictional demo copy check failed:");
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(`Fictional demo copy check passed (${files.length} implementation files scanned).`);
