import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Session } from "./session.model";

export const RefreshToken = pgTable("refresh_token", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  sessionId: varchar("session_id")
    .notNull()
    .references(() => Session.id, { onDelete: "cascade", onUpdate: "set null" }),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
});

export const RefreshTokenRelations = relations(RefreshToken, ({ one }) => ({
  session: one(Session),
}));
