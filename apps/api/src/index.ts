import "dotenv/config";

import { serve, type ServerType } from "@hono/node-server";
import { showRoutes } from "hono/dev";
import { app } from "./app";
import { env } from "./config/env.config";

let server: ServerType;

const main = async () => {
  try {
    server = serve(
      {
        fetch: app.fetch,
        hostname: "0.0.0.0",
        port: env.PORT,
      },
      (info) => {
        console.info(`Server is running on port ${info.port}`, `Address: ${info.address}`);
        showRoutes(app, {
          verbose: true,
          colorize: true,
        });
      },
    );

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    handleStartupError(error);
  }
};

const gracefulShutdown = () => {
  console.info("Received shutdown signal. Closing server...");
  server?.close?.(() => {
    console.info("Server closed gracefully.");
    process.exit(0);
  });
};

const handleStartupError = (error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
};

main();
