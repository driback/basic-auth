import { createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { AuthConst, SessionConst } from "~/constans/auth.constant";
import { generateIdFromEntropySize } from "./crypto.util";

export const generateRefreshToken = () => {
  const token = generateIdFromEntropySize(SessionConst.REFRESH_TOKEN_LENGTH);
  const expiresAt = createDate(SessionConst.REFRESH_TOKEN_SESSION_EXPIRES_IN);

  return { token, expiresAt };
};

export const generateResetToken = () =>
  generateRandomString(AuthConst.RESET_TOKEN_LENGTH, alphabet("a-z", "0-9"));
