import redis from "~/config/redis.config";
import { SessionConst } from "~/constans/auth.constant";
import { getSessionKey } from "~/constans/key.constant";

export const setCacheSession = async (sessionId: string, data: unknown) => {
  await redis.set(
    getSessionKey(sessionId),
    JSON.stringify(data),
    "PX",
    SessionConst.SESSION_EXPIRES_IN.milliseconds(),
  );
};

export const getCachedSession = async <T>(sessionId: string): Promise<T | null> => {
  const cachedSession = await redis.get(getSessionKey(sessionId));
  return cachedSession ? JSON.parse(cachedSession) : null;
};

export const deleteCachedSession = async (sessionId: string) => {
  await redis.del(getSessionKey(sessionId));
};
