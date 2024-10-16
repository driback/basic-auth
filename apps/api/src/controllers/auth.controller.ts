import { getConnInfo } from "@hono/node-server/conninfo";
import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { SessionConst } from "~/constans/auth.constant";
import { CookieRefreshTokenAtributes, CookieSessionAtributes } from "~/constans/cookie.constant";
import { deleteSessionCookies } from "~/middleware/session.helper";
import { sessionMiddleware } from "~/middleware/session.middleware";
import { AuthError } from "~/services/auth.error";
import { AuthService } from "~/services/auth.service";
import { SessionError } from "~/services/session.error";
import type { HonoContext } from "~/types/hono.type";
import { serializeToCookies } from "~/utils/cookie.util";
import { decodePayload } from "~/utils/crypto.util";
import {
  LoginSchema,
  ResetPasswordSchema,
  SendResetPasswordLinkSchema,
  SignupSchema,
} from "../schemas/auth.schema";

const factory = createFactory();

export const loginController = factory.createHandlers(
  zValidator("json", LoginSchema.omit({ ipAddress: true })),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const email = decodePayload(data.email);
    console.log("🚀 ~ email:", email);
    const password = decodePayload(data.password);
    console.log("🚀 ~ password:", password);

    const conInfo = getConnInfo(ctx);

    try {
      const ipAddress = conInfo.remote.address ?? "";
      const result = await AuthService.login({ email, password, ipAddress });

      setCookie(
        ctx,
        SessionConst.COOKIE_NAME,
        serializeToCookies(result.session),
        CookieSessionAtributes,
      );

      setCookie(
        ctx,
        SessionConst.REFRES_TOKEN_COOKIE_NAME,
        serializeToCookies(result.refreshToken),
        CookieRefreshTokenAtributes,
      );

      return ctx.json(result.user, 200);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      if (error instanceof AuthError || error instanceof SessionError) {
        return ctx.json({ message: error.message }, 400);
      }

      return ctx.json({ message: "Something went wrong" }, 500);
    }
  },
);

export const signupController = factory.createHandlers(
  zValidator("json", SignupSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const email = decodePayload(data.email);
    const password = decodePayload(data.password);

    try {
      const result = await AuthService.signup({ email, password });
      return ctx.json(result);
    } catch (error) {
      console.log("🚀 ~ authRoute.post ~ error:", error);
      if (error instanceof AuthError) {
        return ctx.json({ message: error.message }, 400);
      }

      return ctx.json({ message: "Something went wrong" }, 500);
    }
  },
);

export const getMeController = factory.createHandlers(sessionMiddleware(), (ctx) => {
  const user = AuthService.me();
  return ctx.json(user);
});

export const logoutController = factory.createHandlers(sessionMiddleware(), async (ctx) => {
  try {
    await AuthService.logout();
    deleteSessionCookies(ctx);
    return ctx.json({});
  } catch (error) {
    if (error instanceof SessionError) {
      return ctx.json({ message: error.message }, 400);
    }

    return ctx.json({ message: "Something went wrong" }, 500);
  }
});

export const sendResetPasswordLinkController = factory.createHandlers(
  zValidator("json", SendResetPasswordLinkSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");

    try {
      const res = await AuthService.sendResetPasswordLink(data);
      return ctx.json({ token: res });
    } catch (error) {
      console.log("🚀 ~ error:", error);
      if (error instanceof AuthError) {
        return ctx.json({ message: error.message }, 400);
      }

      return ctx.json({ message: "Something went wrong" }, 500);
    }
  },
);

export const resetPasswordController = factory.createHandlers(
  sessionMiddleware(),
  zValidator("json", ResetPasswordSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");

    try {
      const s = ctx.var as HonoContext["Variables"];

      if (s?.session) {
        data.sessionId = s.session.id;
      }

      const res = await AuthService.resetPassword(data);

      if (s?.session) {
        deleteSessionCookies(ctx);
      }

      return ctx.json(res);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      if (error instanceof AuthError) {
        return ctx.json({ message: error.message }, 400);
      }

      return ctx.json({ message: "Something went wrong" }, 500);
    }
  },
);
