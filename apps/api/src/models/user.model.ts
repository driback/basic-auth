import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { AuthCredential } from "./auth_credential.model";
import { AuthProvider } from "./auth_provider.model";
import { Session } from "./session.model";

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  authCredentials: one(AuthCredential),
  authProviders: many(AuthProvider),
  sessions: many(Session),
}));
