import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { User } from "./user.model";

export const AuthProvider = pgTable("auth_provider", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 255 }).notNull(), // e.g., 'google', 'twitter'
  providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

export const AuthProviderRelations = relations(AuthProvider, ({ one }) => ({
  user: one(User, { fields: [AuthProvider.userId], references: [User.id] }),
}));
