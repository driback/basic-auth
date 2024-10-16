import { Hono } from "hono";
import { compress } from "hono/compress";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import authRoute from "./routes/auth.route";

const app = new Hono()
  .use(logger(), prettyJSON())
  .use(trimTrailingSlash())
  .use(
    cors({
      origin: ["http://127.0.0.1:5000"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(contextStorage())
  .use(compress())
  .route("auth", authRoute);

export { app };
