import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const inventoryPath = resolve("docs/component-inventory.md");
const inventory = readFileSync(inventoryPath, "utf8");
const rows = inventory.split(/\r?\n/)
  .filter((line) => /^\| [ABC]\d{2} \|/.test(line))
  .map((line) => {
    const parts = line.split("|").slice(1).map((value) => value.trim());
    if (parts.at(-1) === "") parts.pop();
    // A/B rows use one Story/test cell; older C rows keep the workflow test
    // path in a separate cell. Normalize both shapes before validating.
    const tail = parts.slice(6);
    const storyTest = tail.length === 4 ? `${tail[0]}; ${tail[1]}` : tail[0];
    const status = tail.length === 4 ? tail[2] : tail[1];
    return { id: parts[0], component: parts[3]?.replaceAll("`", ""), storyTest, status, columnCount: parts.length };
  });
const expected = [37, 28, 36];
const errors = [];
if (rows.length !== expected.reduce((sum, value) => sum + value, 0)) errors.push(`inventory rows: expected 101, found ${rows.length}`);
for (const [prefix, count] of [["A", expected[0]], ["B", expected[1]], ["C", expected[2]]]) {
  const found = rows.filter((row) => row.id.startsWith(prefix)).length;
  if (found !== count) errors.push(`${prefix} rows: expected ${count}, found ${found}`);
}
for (const row of rows) {
  if (!row.component) errors.push(`${row.id}: component name missing`);
  if (!row.storyTest) errors.push(`${row.id}: Story / test mapping missing`);
  if (!row.status) errors.push(`${row.id}: implementation status missing`);
  if (![9, 10].includes(row.columnCount)) errors.push(`${row.id}: unexpected inventory column count ${row.columnCount}`);
}

for (const story of ["stories/global-dashboard-components.stories.tsx", "stories/project-browsing.stories.tsx", "stories/detail-components.stories.tsx", "stories/workflow-components.stories.tsx"]) {
  if (!existsSync(resolve(story))) errors.push(`Storybook source missing: ${story}`);
}
for (const test of ["packages/infisson_ui/src/global/global.test.tsx", "packages/infisson_ui/src/detail/detail.test.tsx", "packages/infisson_ui/src/workflow/workflow.test.tsx"]) {
  if (!existsSync(resolve(test))) errors.push(`group test source missing: ${test}`);
}

const aliases = {
  "Logo / Brand": "BrandLogo",
  "NavItem · default": "NavItem", "NavItem · active": "NavItem", "NavItem · count": "NavItem",
  "Button · dark": "Button", "Button · outline": "Button", "Button · cancel": "Button", "Button · apply-fix": "Button",
  "ProjectCard · under-review": "ProjectCard", "ProjectCard · delayed": "ProjectCard", "ProjectCard · missing-docs": "ProjectCard", "ProjectCard · interconnection": "ProjectCard", "ProjectCard · inspection": "ProjectCard",
  "AIFixDialog / Dialog": "AIFixDialog", "DialogTitle / Description": "Dialog", "DialogCloseButton": "Dialog",
  "ProjectHeader · permit": "ProjectHeaderActions", "SubmitButton · pending": "Button",
  "PreviewPackageButton": "Button", "SubmitPackageButton": "Button", "SubmissionStatusBadge": "WorkflowBadge",
  "SubmissionTargetCard · compact": "SubmissionTargetCard", "SubmissionSuccessBanner": "SubmissionSuccessPanel",
};
for (const status of ["ready", "connected", "passed", "submitted", "complete", "on-track"]) aliases[`WorkflowBadge · ${status}`] = "WorkflowBadge";
const files = [];
function collect(path) {
  if (!existsSync(path)) return;
  const info = statSync(path);
  if (info.isFile()) { if (/\.(tsx?|jsx?)$/.test(path)) files.push(path); return; }
  for (const entry of readdirSync(path)) collect(join(path, entry));
}
collect(resolve("packages/infisson_ui/src"));
const exports = new Set([...files.map((file) => readFileSync(file, "utf8")).join("\n").matchAll(/export\s+(?:function|const|class|interface|type)\s+([A-Za-z_$][\w$]*)/g)].map((match) => match[1]));
for (const row of rows) {
  const implementation = aliases[row.component] ?? row.component;
  if (!exports.has(implementation)) errors.push(`${row.id}: ${row.component} maps to missing export ${implementation}`);
}

for (const [group, expectedCount] of [["global", 37], ["detail", 28], ["workflow", 36]]) {
  const indexPath = resolve(`docs/components/${group}/index.md`);
  if (!existsSync(indexPath)) { errors.push(`${group}/index.md missing`); continue; }
  const links = [...readFileSync(indexPath, "utf8").matchAll(/\]\(([^)]+\.zh-en\.md)\)/g)].map((match) => match[1]);
  if (links.length !== expectedCount) errors.push(`${group}/index.md: expected ${expectedCount} docs, found ${links.length}`);
  for (const link of links) if (!existsSync(resolve(`docs/components/${group}`, link))) errors.push(`${group}/${link} missing`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Component coverage verified: 101 inventory IDs, ${exports.size} source exports, 101 indexed bilingual docs.`);
