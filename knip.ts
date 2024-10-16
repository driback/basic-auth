import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: ["drizzle.config.ts"],
  workspaces: {
    "apps/api": {
      entry: ["src/index.ts", "src/hc.ts"],
      project: ["src/**"],
    },
  },
};

export default config;
