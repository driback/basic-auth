import { Redis } from "ioredis";
import { env } from "./env.config";

const createConnection = () => {
  let redis: Redis | null = null;

  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      retryStrategy: (times) => {
        return Math.min(times * 100, 5000); // Exponential backoff, max 5 seconds
      },
      connectTimeout: 10000, // 10 seconds
      maxRetriesPerRequest: 50, // Allow for more retries
    });
  }

  let connectionAttempts = 0;

  redis.on("connect", () => {
    connectionAttempts = 0; // Reset attempts on successful connection
    console.log("Connected to Redis");
  });

  redis.on("reconnecting", () => {
    connectionAttempts++;
    console.log(`Reconnecting to Redis, attempt #${connectionAttempts}`);
  });

  redis.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  return redis;
};

export default createConnection();
