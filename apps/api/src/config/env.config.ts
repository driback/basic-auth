import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SECRET: z.string(),
    PORT: z.string().transform((s) => Number(s)),
    NODE_ENV: z
      .union([z.literal("production"), z.literal("development"), z.literal("staging")])
      .default("development"),
  },
  runtimeEnv: process.env,
});
