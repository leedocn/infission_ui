import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve("docs/components");
const groups = [
  ["global", 37],
  ["detail", 28],
  ["workflow", 36],
];
const required = [
  "安装与导入 / Install and import",
  "Props / 属性",
  "可复制调用 / Copyable usage",
  "状态与边界 / States and edge cases",
  "无障碍 / Accessibility",
  "主题与配图 / Theme and visual reference",
  "![",
];
const failures = [];
let checked = 0;

for (const [group, expected] of groups) {
  const indexPath = resolve(root, group, "index.md");
  if (!existsSync(indexPath)) {
    failures.push(`${group}/index.md is missing`);
    continue;
  }
  const index = readFileSync(indexPath, "utf8");
  const links = [...index.matchAll(/\]\(([^)]+\.zh-en\.md)\)/g)].map((match) => match[1]);
  if (links.length !== expected) failures.push(`${group}: expected ${expected} indexed docs, found ${links.length}`);
  for (const link of links) {
    const docPath = resolve(root, group, link);
    checked += 1;
    if (!existsSync(docPath)) {
      failures.push(`${group}/${link} is missing`);
      continue;
    }
    const source = readFileSync(docPath, "utf8");
    for (const marker of required) {
      if (!source.includes(marker)) failures.push(`${group}/${link} is missing: ${marker}`);
    }
    for (const [, imagePath] of source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|data:)/.test(imagePath)) continue;
      if (!existsSync(resolve(dirname(docPath), imagePath))) failures.push(`${group}/${link} references missing image: ${imagePath}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated ${checked} bilingual component help files across A/B/C indexes.`);
