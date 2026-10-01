import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = resolve(root, "packages/infisson_ui");
const consumerRoot = resolve(root, "tests/consumer-smoke");
const artifactsRoot = resolve(root, "artifacts");
const runRoot = resolve(artifactsRoot, ".consumer-smoke-run");

function commandName(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function run(name, args, cwd) {
  const command = commandName(name);
  const spawnFile = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : command;
  const spawnArgs = process.platform === "win32"
    ? ["/d", "/s", "/c", [command, ...args].map((arg) => /\s/.test(arg) ? `"${arg.replaceAll('"', '\\"')}"` : arg).join(" ")]
    : args;
  const result = spawnSync(spawnFile, spawnArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${name} ${args.join(" ")} exited with ${result.status}`);
}

const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
const tarballName = `${packageJson.name}-${packageJson.version}.tgz`;
const tarballPath = resolve(artifactsRoot, tarballName);

await mkdir(artifactsRoot, { recursive: true });
await rm(runRoot, { recursive: true, force: true });

// Build and pack first. The smoke project below only receives the tarball, so
// a workspace source alias cannot accidentally make this check pass.
run("pnpm", ["--dir", "packages/infisson_ui", "build"], root);
run("npm", ["pack", "--pack-destination", artifactsRoot], packageRoot);

if (!existsSync(tarballPath)) throw new Error(`Expected package tarball was not created: ${tarballPath}`);

try {
  await cp(consumerRoot, runRoot, {
    recursive: true,
    filter(source) {
      return !source.includes(`${resolve(consumerRoot, "node_modules")}`) && !source.includes(`${resolve(consumerRoot, "dist")}`);
    }
  });

  const consumerPackagePath = resolve(runRoot, "package.json");
  const consumerPackage = JSON.parse(await readFile(consumerPackagePath, "utf8"));
  const packageReference = relative(runRoot, tarballPath).replaceAll("\\", "/");
  consumerPackage.dependencies = {
    ...consumerPackage.dependencies,
    infisson_ui: `file:${packageReference}`
  };
  await writeFile(consumerPackagePath, `${JSON.stringify(consumerPackage, null, 2)}\n`, "utf8");

  // This directory is outside the workspace package globs, and the explicit
  // flag keeps the check independent from the root workspace protocol.
  run("pnpm", ["install", "--ignore-workspace", "--no-frozen-lockfile"], runRoot);
  run("pnpm", ["exec", "tsc", "--noEmit"], runRoot);
  run("pnpm", ["run", "build"], runRoot);
} finally {
  await rm(runRoot, { recursive: true, force: true });
}

console.log(`Consumer smoke passed against ${tarballName}.`);
