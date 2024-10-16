import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { AuthCredential } from "./auth_credential.model";

export const ResetToken = pgTable("reset_token", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  authCredentialId: uuid("auth_credential_id")
    .notNull()
    .references(() => AuthCredential.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).unique().notNull(),
  used: boolean("used").default(false),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
});

export const ResetTokenRelations = relations(ResetToken, ({ one }) => ({
  authCrendential: one(AuthCredential, {
    fields: [ResetToken.authCredentialId],
    references: [AuthCredential.id],
  }),
}));
