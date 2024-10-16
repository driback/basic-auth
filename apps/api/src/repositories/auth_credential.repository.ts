import { eq } from "drizzle-orm";
import { AuthCredential } from "~/models/auth_credential.model";
import { BaseRepository } from "./base.repository";

class AuthCredentialRepo extends BaseRepository {
  async findByEmail(email: string) {
    return await this.dbInstance.query.AuthCredential.findFirst({
      where: (au, { eq }) => eq(au.email, email),
    });
  }

  async fingByUserId(userId: string) {
    return await this.dbInstance.query.AuthCredential.findFirst({
      where: (au, { eq }) => eq(au.userId, userId),
    });
  }

  async create(values: typeof AuthCredential.$inferInsert) {
    const [res] = await this.dbInstance.insert(AuthCredential).values(values).returning();
    return res;
  }

  async deleteByEmail(email: string) {
    const [res] = await this.dbInstance
      .delete(AuthCredential)
      .where(eq(AuthCredential.email, email))
      .returning();
    return !!res;
  }

  async updateByEmail(email: string, values: Partial<typeof AuthCredential.$inferInsert>) {
    const [res] = await this.dbInstance
      .update(AuthCredential)
      .set(values)
      .where(eq(AuthCredential.email, email))
      .returning();
    return res;
  }

  async updateById(id: string, values: Partial<typeof AuthCredential.$inferInsert>) {
    const [res] = await this.dbInstance
      .update(AuthCredential)
      .set(values)
      .where(eq(AuthCredential.id, id))
      .returning();
    return res;
  }
}

export const AuthCredentialRepository = new AuthCredentialRepo();
