import { and, eq, lte } from "drizzle-orm";
import { db } from "~/config/db.config";
import { Session, User } from "~/models";
import { BaseRepository } from "./base.repository";

class SessionRepo extends BaseRepository {
  async createSession(values: typeof Session.$inferInsert) {
    const [res] = await db.insert(Session).values(values).returning();
    return res;
  }

  async getSession(id: string) {
    return await db.query.Session.findFirst({ where: (se, { eq }) => eq(se.id, id) });
  }

  async getAllSessionByUserId(userId: string) {
    return db.query.Session.findMany({ where: (se, { eq }) => eq(se.userId, userId) });
  }

  async getSessionAndUser(sessionId: string) {
    const result = await db
      .select({
        user: User,
        session: Session,
      })
      .from(Session)
      .innerJoin(User, eq(Session.userId, User.id))
      .where(eq(Session.id, sessionId));
    if (result.length !== 1) return null;

    return result[0]!;
  }

  async updateSessionExpiration(sessionId: string, expiresAt: Date) {
    const [res] = await db
      .update(Session)
      .set({ expiresAt })
      .where(eq(Session.id, sessionId))
      .returning();
    return res;
  }

  async updateSession(
    oldSessionId: string,
    userId: string,
    values: Partial<typeof Session.$inferInsert>,
  ) {
    const [res] = await db
      .update(Session)
      .set(values)
      .where(and(eq(Session.id, oldSessionId), eq(Session.userId, userId)))
      .returning();
    return res;
  }

  async deleteBySessionId(sessionId: string) {
    const [res] = await db.delete(Session).where(eq(Session.id, sessionId)).returning();
    return res;
  }

  async deleteByUserId(userId: string) {
    const [res] = await db.delete(Session).where(eq(Session.userId, userId)).returning();
    return res;
  }

  async deleteExpiresSessionByUserId(userId: string) {
    const [res] = await db
      .delete(Session)
      .where(and(eq(Session.userId, userId), lte(Session.expiresAt, new Date())))
      .returning();
    return res;
  }
}

export const SessionRepository = new SessionRepo();
