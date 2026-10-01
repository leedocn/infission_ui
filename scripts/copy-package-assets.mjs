import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../packages/infisson_ui");
const dist = resolve(packageRoot, "dist");

await mkdir(dist, { recursive: true });
const [tokens, styles, detail, workflow, global] = await Promise.all([
  readFile(resolve(packageRoot, "src/tokens.css"), "utf8"),
  readFile(resolve(packageRoot, "src/styles.css"), "utf8"),
  readFile(resolve(packageRoot, "src/detail/detail.css"), "utf8"),
  readFile(resolve(packageRoot, "src/workflow/styles.css"), "utf8"),
  readFile(resolve(packageRoot, "src/global/styles.css"), "utf8"),
]);
const baseStyles = styles
  .replace(/@import\s+["']\.\/tokens\.css["'];?/g, "")
  .replace(/@import\s+["']\.\/detail\/detail\.css["'];?/g, "")
  .replace(/@import\s+["']\.\/workflow\/styles\.css["'];?/g, "")
  .replace(/@import\s+["']\.\/global\/styles\.css["'];?/g, "");
await writeFile(resolve(dist, "styles.css"), [tokens, baseStyles, detail, workflow, global].join("\n"));
await copyFile(resolve(packageRoot, "src/tokens.css"), resolve(dist, "tokens.css"));
await copyFile(resolve(packageRoot, "src/workflow/styles.css"), resolve(dist, "workflow.css"));
