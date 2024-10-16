import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/hc.ts"], // Entry point for your Hono app
  outDir: "dist", // Output directory for the bundled code
  format: ["esm", "cjs"], // Bundle formats
  target: "es2020", // Target ES version
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output directory before bundling
  dts: true, // Generate type declaration files
  minify: true, // Minify the bundle for smaller output
  external: ["@node-rs", "dotenv"], // External dependencies that you don’t want to bundle (optional)
});
