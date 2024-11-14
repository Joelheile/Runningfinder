import { relations } from "drizzle-orm/relations";
import {
  avatars,
  clubs,
  users,
  memberships,
  runs,
  registrations,
  session,
  authenticator,
  account,
} from "./schema";

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  avatar: one(avatars, {
    fields: [clubs.avatarFileId],
    references: [avatars.id],
  }),
  memberships: many(memberships),
  runs: many(runs),
}));

export const avatarsRelations = relations(avatars, ({ many }) => ({
  clubs: many(clubs),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [memberships.clubId],
    references: [clubs.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  registrations: many(registrations),
  sessions: many(session),
  authenticators: many(authenticator),
  accounts: many(account),
}));

export const runsRelations = relations(runs, ({ one, many }) => ({
  club: one(clubs, {
    fields: [runs.clubId],
    references: [clubs.id],
  }),
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  run: one(runs, {
    fields: [registrations.runId],
    references: [runs.id],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
  user: one(users, {
    fields: [authenticator.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));
