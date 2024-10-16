import type { Context } from "hono";
import { deleteCookie } from "hono/cookie";
import { env } from "~/config/env.config";
import { SessionConst } from "~/constans/auth.constant";

export const setNullSession = (ctx: Context) => {
  ctx.set("user", null);
  ctx.set("session", null);
  ctx.set("refreshToken", null);
};

export const handleSessionError = (ctx: Context, message: string, error?: unknown) => {
  console.error(`Session middleware error: ${message}`, error);
  setNullSession(ctx);
};

export const deleteSessionCookies = (ctx: Context) => {
  deleteCookie(ctx, SessionConst.COOKIE_NAME, {
    path: "/",
    secure: env.NODE_ENV === "production",
  });
  deleteCookie(ctx, SessionConst.REFRES_TOKEN_COOKIE_NAME, {
    path: "/",
    secure: env.NODE_ENV === "production",
  });
  setNullSession(ctx);
};
