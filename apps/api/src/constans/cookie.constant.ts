import type { CookieOptions } from "hono/utils/cookie";
import { createDate } from "oslo";
import { env } from "~/config/env.config";
import { SessionConst } from "./auth.constant";

export const CookieSessionAtributes: CookieOptions = {
  path: "/",
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: env.NODE_ENV !== "production" ? "lax" : "strict",
  expires: createDate(SessionConst.SESSION_EXPIRES_IN),
};

export const CookieRefreshTokenAtributes: CookieOptions = {
  path: "/",
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: env.NODE_ENV !== "production" ? "lax" : "strict",
  expires: createDate(SessionConst.REFRESH_TOKEN_SESSION_EXPIRES_IN),
};
