import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../models";
import { env } from "./env.config";

declare global {
  var __dbConn: postgres.Sql | undefined;
}

// Create a connection and log success or failure
const createConnection = () => {
  try {
    const conn = postgres(env.DATABASE_URL);
    console.log("Database connected successfully");
    return conn;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error; // rethrow to avoid silent failures
  }
};

const conn = global.__dbConn ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  global.__dbConn = conn;
}

export const db = drizzle(conn, { schema });
export type DBSchemas = typeof schema;
