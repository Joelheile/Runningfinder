import { relations } from "drizzle-orm/relations";
import { users, session, memberships, clubs, registrations, runs, avatars, authenticator, account } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(session),
	memberships: many(memberships),
	registrations: many(registrations),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const membershipsRelations = relations(memberships, ({one}) => ({
	user: one(users, {
		fields: [memberships.userId],
		references: [users.id]
	}),
	club: one(clubs, {
		fields: [memberships.clubId],
		references: [clubs.id]
	}),
}));

export const clubsRelations = relations(clubs, ({one, many}) => ({
	memberships: many(memberships),
	avatar: one(avatars, {
		fields: [clubs.avatarFileId],
		references: [avatars.id]
	}),
	runs: many(runs),
}));

export const registrationsRelations = relations(registrations, ({one}) => ({
	user: one(users, {
		fields: [registrations.userId],
		references: [users.id]
	}),
	run: one(runs, {
		fields: [registrations.runId],
		references: [runs.id]
	}),
}));

export const runsRelations = relations(runs, ({one, many}) => ({
	registrations: many(registrations),
	club: one(clubs, {
		fields: [runs.clubId],
		references: [clubs.id]
	}),
}));

export const avatarsRelations = relations(avatars, ({many}) => ({
	clubs: many(clubs),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(users, {
		fields: [authenticator.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));