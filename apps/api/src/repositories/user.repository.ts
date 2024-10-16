import { eq } from "drizzle-orm";
import { AuthCredential, User } from "~/models";
import { BaseRepository } from "./base.repository";

class UserRepo extends BaseRepository {
  async create(values: typeof User.$inferInsert) {
    const [res] = await this.dbInstance.insert(User).values(values).returning();
    return res;
  }

  async findByEmail(email: string) {
    const cred = this.dbInstance
      .select({ id: AuthCredential.userId })
      .from(AuthCredential)
      .where(eq(AuthCredential.email, email));
    return await this.dbInstance.query.User.findFirst({
      where: (us, { eq }) => eq(us.id, cred),
    });
  }

  async findById(id: string) {
    return await this.dbInstance.query.User.findFirst({
      where: (us, { eq }) => eq(us.id, id),
    });
  }

  async updateById(id: string, values: Partial<typeof User.$inferInsert>) {
    const [res] = await this.dbInstance.update(User).set(values).where(eq(User.id, id)).returning();
    return res;
  }

  async deleteById(id: string) {
    const [res] = await this.dbInstance.delete(User).where(eq(User.id, id)).returning();
    return res;
  }
}

export const UserRepository = new UserRepo();
