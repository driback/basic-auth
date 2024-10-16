import { getConnInfo } from "@hono/node-server/conninfo";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { env } from "~/config/env.config";
import { SessionConst } from "~/constans/auth.constant";
import { CookieRefreshTokenAtributes, CookieSessionAtributes } from "~/constans/cookie.constant";
import { SessionService } from "~/services/session.service";
import { parseCookies, serializeToCookies } from "~/utils/cookie.util";
import { deleteSessionCookies, handleSessionError, setNullSession } from "./session.helper";

export const sessionMiddleware = () =>
  createMiddleware(async (ctx, next) => {
    try {
      const cookieSession = getCookie(ctx, SessionConst.COOKIE_NAME);
      if (!cookieSession) {
        console.warn("Session cookie missing");
        setNullSession(ctx);
        return next();
      }

      const sessionId = parseCookies(cookieSession).id as string;
      const { session, user, refreshToken } = await SessionService.validateSession(sessionId);
      if (session) {
        ctx.set("session", session);
        ctx.set("user", user);
        ctx.set("refreshToken", refreshToken);
      } else {
        console.warn(`Invalid or expired session for ID: ${sessionId}`);

        const cookieRefreshToken = getCookie(ctx, SessionConst.REFRES_TOKEN_COOKIE_NAME);
        if (!cookieRefreshToken) {
          console.warn("Refresh token missing");
          deleteCookie(ctx, SessionConst.COOKIE_NAME, {
            path: "/",
            secure: env.NODE_ENV === "production",
          });
          setNullSession(ctx);
          return next();
        }

        try {
          const conInfo = getConnInfo(ctx);
          const ipAddress = conInfo.remote.address ?? "0.0.0.0";

          const { session: newSession, refreshToken: newRefreshToken } =
            await SessionService.refreshSession(cookieRefreshToken, ipAddress);

          setCookie(
            ctx,
            SessionConst.COOKIE_NAME,
            serializeToCookies(newSession),
            CookieSessionAtributes,
          );
          setCookie(
            ctx,
            SessionConst.REFRES_TOKEN_COOKIE_NAME,
            serializeToCookies(newRefreshToken),
            CookieRefreshTokenAtributes,
          );

          ctx.set("session", newSession);
          ctx.set("user", user);
          ctx.set("refreshToken", newRefreshToken);
        } catch (refreshError) {
          console.error("Failed to refresh session", refreshError);
          deleteSessionCookies(ctx);
        }
      }
    } catch (error) {
      handleSessionError(ctx, "Failed to validate session", error);
    }

    return next();
  });
