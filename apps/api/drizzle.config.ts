import "dotenv/config";

import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const nonPoolingUrl = process.env.DATABASE_URL.replace(":6543", ":5432");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models",
  introspect: { casing: "camel" },
  out: "drizzle",
  verbose: true,
  strict: true,
  dbCredentials: { url: nonPoolingUrl },
});
