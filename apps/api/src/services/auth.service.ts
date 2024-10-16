import type { z } from "zod";
import type { HonoContext, User } from "~/types/hono.type";

import { getContext } from "hono/context-storage";
import { isWithinExpirationDate } from "oslo";
import { db } from "~/config/db.config";
import { AuthCredentialRepository } from "~/repositories/auth_credential.repository";
import { ResetTokenRepository } from "~/repositories/reset_token.repository";
import { UserRepository } from "~/repositories/user.repository";
import type {
  LoginSchema,
  ResetPasswordSchema,
  SendResetPasswordLinkSchema,
  SignupSchema,
} from "~/schemas/auth.schema";
import { comparePassword, hashPassword } from "~/utils/password.util";
import { AuthError } from "./auth.error";
import { SessionService } from "./session.service";
import { TokenService } from "./token.service";

export const AuthService = {
  login: async (props: z.infer<typeof LoginSchema>) => {
    const { email, password, ipAddress } = props;

    const cred = await AuthCredentialRepository.findByEmail(email);
    if (!cred?.passwordHash) throw AuthError.create("CREDENTIAL_NOT_FOUND");

    const isPasswordValid = await comparePassword(password, cred.passwordHash);
    if (!isPasswordValid) throw AuthError.create("PASSWORD_MISMATCH");

    const user = await UserRepository.findById(cred.userId);
    if (!user) throw AuthError.create("USER_NOT_FOUND");

    const { session, refreshToken } = await SessionService.createSession(user.id, ipAddress);

    const nuser: User = {
      name: user.name,
      image: user.image,
    };

    return { user: nuser, session, refreshToken };
  },

  signup: async (props: z.infer<typeof SignupSchema>) => {
    const { email, password } = props;

    const userCred = await AuthCredentialRepository.findByEmail(email);
    if (userCred?.email) throw AuthError.create("EMAIL_IN_USE");

    const { user } = await db.transaction(
      async (tx) => {
        const user = await UserRepository.withTransaction(tx).create({ name: "OKOK" });
        if (!user) throw AuthError.create("FAILED_CREATE_USER");

        const hashedPassword = await hashPassword(password);

        const cred = await AuthCredentialRepository.withTransaction(tx).create({
          email,
          passwordHash: hashedPassword,
          userId: user.id,
        });
        if (!cred) throw AuthError.create("FAILED_CREATE_CREDENTIAL");

        const nuser: User = {
          name: user.name,
          image: user.image,
        };

        return { user: nuser };
      },
      {
        isolationLevel: "read committed",
        accessMode: "read write",
        deferrable: true,
      },
    );

    return { user };
  },

  me: () => {
    return getContext<HonoContext>().var.user;
  },

  logout: async () => {
    const session = getContext<HonoContext>().var.session;
    return await SessionService.invalidateSession(session?.id ?? "");
  },

  sendResetPasswordLink: async (props: z.infer<typeof SendResetPasswordLinkSchema>) => {
    const user = await UserRepository.findByEmail(props.email);
    if (!user) throw AuthError.create("USER_NOT_FOUND");

    const createResetToken = await TokenService.createResetToken(user.id);
    return createResetToken;
  },

  resetPassword: async (props: z.infer<typeof ResetPasswordSchema>) => {
    console.log("🚀 ~ resetPassword: ~ props:", props);
    const findToken = await ResetTokenRepository.findByToken(props.token);
    if (!findToken) throw AuthError.create("RESET_TOKEN_NOT_FOUND");
    if (findToken.used) throw AuthError.create("USED_RESET_TOKEN");
    if (!isWithinExpirationDate(findToken.expiresAt)) throw AuthError.create("EXPIRED_RESET_TOKEN");

    const updatePassword = await db.transaction(async (tx) => {
      const hashedPassword = await hashPassword(props.newPassword);
      const updatingPassword = await AuthCredentialRepository.withTransaction(tx).updateById(
        findToken.authCredentialId,
        {
          passwordHash: hashedPassword,
        },
      );
      if (!updatingPassword) throw AuthError.create("FAILED_UPDATE_PASSWORD");
      await ResetTokenRepository.withTransaction(tx).updateById(findToken.id, { used: true });

      if (props.sessionId) {
        await SessionService.invalidateSession(props.sessionId);
      }

      return updatingPassword;
    });

    const output = {
      email: updatePassword.email,
      username: updatePassword.username,
    };

    return output;
  },
};
