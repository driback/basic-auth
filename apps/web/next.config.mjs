import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/env.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vevibe/ui"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};

export default nextConfig;
