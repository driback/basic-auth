import { createDate } from "oslo";
import { AuthConst } from "~/constans/auth.constant";
import { AuthCredentialRepository } from "~/repositories/auth_credential.repository";
import type { TransactionType } from "~/repositories/base.repository";
import { RefreshTokenRepository } from "~/repositories/refresh_token.repository";
import { ResetTokenRepository } from "~/repositories/reset_token.repository";
import { generateRefreshToken, generateResetToken } from "~/utils/token.util";
import { TokenError } from "./token.error";

type CreateRefreshTokenProps = {
  sessionId: string;
  trx?: TransactionType;
};

export const TokenService = {
  createRefreshToken: async ({ sessionId, trx }: CreateRefreshTokenProps) => {
    const refreshToken = generateRefreshToken();

    const createRefreshToken = await RefreshTokenRepository.withTransaction(trx).createToken({
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
      sessionId,
    });
    if (!createRefreshToken) throw TokenError.create("FAILED_CREATE_REFRESH_TOKEN");
    return createRefreshToken;
  },

  createResetToken: async (userId: string) => {
    const cred = await AuthCredentialRepository.fingByUserId(userId);
    if (!cred) throw TokenError.create("USER_CREDENTIAL_NOT_FOUND");

    const token = generateResetToken();
    const createToken = await ResetTokenRepository.createToken({
      authCredentialId: cred.id,
      token,
      expiresAt: createDate(AuthConst.RESET_TOKEN_EXPIRES_IN),
    });
    if (!createToken) throw TokenError.create("FAILED_CREATE_RESET_TOKEN");

    return token;
  },

  getRefreshToken: async (token: string) => {
    const refreshToken = await RefreshTokenRepository.findByToken(token);
    if (!refreshToken) throw TokenError.create("MISSING_REFRESH_TOKEN");
    return refreshToken;
  },
};
