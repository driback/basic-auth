import { createDate, isWithinExpirationDate } from "oslo";
import pRetry from "p-retry";
import { db } from "~/config/db.config";
import { SessionConst } from "~/constans/auth.constant";
import { RefreshTokenRepository } from "~/repositories/refresh_token.repository";
import { SessionRepository } from "~/repositories/session.repository";
import { UserRepository } from "~/repositories/user.repository";
import type { RefreshToken, Session, User } from "~/types/hono.type";
import { generateIdFromEntropySize } from "~/utils/crypto.util";
import { SessionError } from "./session.error";
import { deleteCachedSession, getCachedSession, setCacheSession } from "./session.helper";
import { TokenService } from "./token.service";

export const SessionService = {
  createSession: async (userId: string, ipAddress: string) => {
    const sessionId = generateIdFromEntropySize(25);
    const sessionExpiresAt = createDate(SessionConst.SESSION_EXPIRES_IN);

    const trxs = await db.transaction(async (trx) => {
      const createSession = await SessionRepository.withTransaction(trx).createSession({
        id: sessionId,
        userId,
        ipAddress,
        expiresAt: sessionExpiresAt,
      });
      if (!createSession) throw SessionError.create("PERSIST_SESSION_FAILED");

      const createRefreshToken = await TokenService.createRefreshToken({
        sessionId: createSession.id,
        trx,
      });

      await pRetry(() => setCacheSession(createSession.id, createSession), { retries: 3 });

      const output: { session: Session; refreshToken: RefreshToken } = {
        session: {
          id: createSession.id,
          ipAddress: createSession.ipAddress,
          userId: createSession.userId,
        },
        refreshToken: {
          token: createRefreshToken.token,
          sessionId: createSession.id,
          expiresAt: createRefreshToken.expiresAt.getDate(),
        },
      };

      return output;
    });

    return trxs;
  },

  validateSession: async (sessionId: string) => {
    const cachedSession = await getCachedSession<Session>(sessionId);
    if (!cachedSession) throw SessionError.create("INVALID_SESSION");

    const [user, refreshToken] = await Promise.all([
      UserRepository.findById(cachedSession.userId),
      RefreshTokenRepository.findBySessionId(sessionId),
    ]);

    if (!user || !refreshToken) {
      await SessionService.invalidateSession(sessionId);
      throw SessionError.create("INVALID_SESSION");
    }

    const output: { user: User; session: Session; refreshToken: RefreshToken } = {
      user,
      session: cachedSession,
      refreshToken: {
        token: refreshToken.token,
        sessionId,
        expiresAt: refreshToken.expiresAt.getDate(),
      },
    };

    return output;
  },

  refreshSession: async (oldRefreshToken: string, ipAddress: string) => {
    const token = await RefreshTokenRepository.findByToken(oldRefreshToken);
    if (!token) throw SessionError.create("REFRESH_TOKEN_NOT_FOUND");
    if (!isWithinExpirationDate(token.expiresAt))
      throw SessionError.create("EXPIRED_REFRESH_TOKEN");

    const oldCachedSession = await getCachedSession<Session>(token.sessionId);
    if (!oldCachedSession) throw SessionError.create("SESSION_NOT_FOUND");

    const newSession = await SessionService.createSession(oldCachedSession.userId, ipAddress);
    await SessionService.invalidateSession(oldCachedSession.id);

    return newSession;
  },

  invalidateSession: async (sessionId: string) => {
    const session = await getCachedSession<Session>(sessionId);
    if (!session) throw SessionError.create("SESSION_NOT_FOUND");

    const deleteSession = await SessionRepository.deleteBySessionId(sessionId);
    if (!deleteSession) throw SessionError.create("FAILED_DELETE_SESSION");

    await pRetry(() => deleteCachedSession(sessionId), { retries: 3 });
  },

  invalidateUserSessions: async (userId: string) => {
    const session = await SessionRepository.getAllSessionByUserId(userId);
    if (!session) throw SessionError.create("USER_SESSION_NOT_FOUND");
    await SessionRepository.deleteByUserId(userId);
    await Promise.all(session.map((s) => deleteCachedSession(s.id)));
  },
};
