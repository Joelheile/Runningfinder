import { relations } from "drizzle-orm/relations";
import {
  user,
  membership,
  club,
  run,
  session,
  registration,
  authenticator,
  account,
} from "./schema";

export const membershipRelations = relations(membership, ({ one }) => ({
  user: one(user, {
    fields: [membership.userId],
    references: [user.id],
  }),
  club: one(club, {
    fields: [membership.clubId],
    references: [club.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  memberships: many(membership),
  sessions: many(session),
  registrations: many(registration),
  authenticators: many(authenticator),
  accounts: many(account),
}));

export const clubRelations = relations(club, ({ many }) => ({
  memberships: many(membership),
  runs: many(run),
}));

export const runRelations = relations(run, ({ one, many }) => ({
  club: one(club, {
    fields: [run.clubId],
    references: [club.id],
  }),
  registrations: many(registration),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const registrationRelations = relations(registration, ({ one }) => ({
  run: one(run, {
    fields: [registration.runId],
    references: [run.id],
  }),
  user: one(user, {
    fields: [registration.userId],
    references: [user.id],
  }),
}));

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
  user: one(user, {
    fields: [authenticator.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
