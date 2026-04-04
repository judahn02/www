import { readdir, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { build, context } from "esbuild";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "js");
const outDir = path.join(rootDir, "js-compiled");
const jqueryInjectPath = path.join(sourceDir, "shims", "jquery-global.js");

const args = new Set(process.argv.slice(2));
const isWatch = args.has("--watch");
const modeArg = [...args].find((arg) => arg.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "production";
const isProduction = mode === "production";

if (mode !== "production" && mode !== "development") {
  console.error("Unsupported mode. Use --mode=production or --mode=development.");
  process.exit(1);
}

const entries = (await readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
  .map((entry) => path.join(sourceDir, entry.name))
  .sort();

if (entries.length === 0) {
  console.error("No entry files found in js/");
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const config = {
  entryPoints: entries,
  inject: [jqueryInjectPath],
  outdir: outDir,
  entryNames: "[name]",
  bundle: true,
  platform: "browser",
  format: "iife",
  target: ["es2018"],
  minify: isProduction,
  sourcemap: isProduction ? false : true,
  logLevel: "info"
};

if (isWatch) {
  const ctx = await context(config);
  await ctx.watch();
  console.log("Watching JS files and writing bundles to js-compiled/ ...");
} else {
  await build(config);
  console.log(`Built ${entries.length} bundle(s) to js-compiled/ in ${mode} mode.`);
}
