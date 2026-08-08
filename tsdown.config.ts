import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolver: "oxc",
  },
  deps: {
    neverBundle: ["react", "react-dom"],
  },
  publint: true,
});