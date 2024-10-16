import { eq } from "drizzle-orm";
import { RefreshToken } from "~/models";
import { BaseRepository } from "./base.repository";

class RefreshTokenRepo extends BaseRepository {
  async findByToken(token: string) {
    return await this.dbInstance.query.RefreshToken.findFirst({
      where: (rf, { eq }) => eq(rf.token, token),
    });
  }

  async findBySessionId(sessionId: string) {
    return await this.dbInstance.query.RefreshToken.findFirst({
      where: (rf, { eq }) => eq(rf.sessionId, sessionId),
    });
  }

  async createToken(values: typeof RefreshToken.$inferInsert) {
    const [res] = await this.dbInstance.insert(RefreshToken).values(values).returning();
    return res;
  }

  async deleteTokenByToken(token: string) {
    const [res] = await this.dbInstance
      .delete(RefreshToken)
      .where(eq(RefreshToken.token, token))
      .returning();
    return res;
  }
}

export const RefreshTokenRepository = new RefreshTokenRepo();
