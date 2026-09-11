#!/usr/bin/env node
// tsdown's own CSS handling (@tsdown/css, Lightning CSS-based) only resolves
// `@import` statements — it doesn't run Tailwind's content scanner, so it
// can't generate the utility classes components actually use. We compile
// src/styles.css with the real Tailwind CLI instead; its automatic source
// detection picks up class names from src/components/**/*.tsx on its own,
// no explicit @source needed.
//
// Runs as "prebuild" (before tsdown) rather than "postbuild" so the file
// exists in time for tsdown's own publint exports check.
//
// dist/style.css is NOT wired into the JS entry points as a side-effect
// import. A consumer's bundler that splits vendor CSS into its own chunk
// (Turbopack does this for node_modules) would load it as a separate
// stylesheet from the consumer's own Tailwind build; same-named CSS cascade
// layers (e.g. "utilities") merge across stylesheets in load order, so our
// compiled utilities can end up shadowing the consumer's own responsive
// overrides for any class we both happen to generate (e.g. `.hidden`
// winning over their `.md:flex`) with no way for them to opt out short of
// not using components at all. Consumers should follow the README instead:
// copy the token bridge and let their own Tailwind build's automatic source
// detection (or an explicit @source) pick up class names straight from this
// package's dist output, in one unified compilation.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");

fs.mkdirSync(distDir, { recursive: true });

execFileSync(
  path.join(root, "node_modules/.bin/tailwindcss"),
  [
    "-i",
    path.join(root, "src/styles.css"),
    "-o",
    path.join(distDir, "style.css"),
    "--minify",
  ],
  { stdio: "inherit" },
);
