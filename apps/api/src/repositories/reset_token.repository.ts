import { eq } from "drizzle-orm";
import { ResetToken } from "~/models";
import { BaseRepository } from "./base.repository";

class ResetTokenRepo extends BaseRepository {
  async createToken(value: typeof ResetToken.$inferInsert) {
    const [res] = await this.dbInstance.insert(ResetToken).values(value).returning();
    return res;
  }

  async findByToken(token: string) {
    return await this.dbInstance.query.ResetToken.findFirst({
      where: (rs, { eq }) => eq(rs.token, token),
    });
  }

  async updateById(id: string, values: Partial<typeof ResetToken.$inferInsert>) {
    const [res] = await this.dbInstance
      .update(ResetToken)
      .set(values)
      .where(eq(ResetToken.id, id))
      .returning();
    return res;
  }
}

export const ResetTokenRepository = new ResetTokenRepo();
