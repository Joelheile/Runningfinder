import { pgTable, index, foreignKey, uuid, timestamp, date, text, time, numeric, integer, unique, primaryKey, boolean, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['member', 'admin', 'manager'])
export const status = pgEnum("status", ['pending', 'active', 'deactivated', 'banned'])



export const membership = pgTable("membership", {
	id: uuid("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	clubId: uuid("club_id").notNull(),
	joinDate: timestamp("join_date", { mode: 'string' }).notNull(),
	status: status("status").default('pending'),
	role: role("role").default('member'),
},
(table) => {
	return {
		clubIdIdx: index().using("btree", table.clubId.asc().nullsLast()),
		userIdIdx: index().using("btree", table.userId.asc().nullsLast()),
		membershipUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "membership_user_id_user_id_fk"
		}),
		membershipClubIdClubIdFk: foreignKey({
			columns: [table.clubId],
			foreignColumns: [club.id],
			name: "membership_club_id_club_id_fk"
		}),
	}
});

export const run = pgTable("run", {
	id: uuid("id").primaryKey().notNull(),
	clubId: uuid("club_id").notNull(),
	date: date("date").notNull(),
	startDescription: text("start_description").notNull(),
	startTime: time("start_time").notNull(),
	positionLang: numeric("position_lang").notNull(),
	positionLat: numeric("position_lat").notNull(),
	distance: numeric("distance").notNull(),
	temperature: numeric("temperature"),
	wind: numeric("wind"),
	uvIndex: numeric("uv_index"),
},
(table) => {
	return {
		runClubIdClubIdFk: foreignKey({
			columns: [table.clubId],
			foreignColumns: [club.id],
			name: "run_club_id_club_id_fk"
		}),
	}
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: uuid("userId").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const club = pgTable("club", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	positionLang: numeric("position_lang").notNull(),
	positionLat: numeric("position_lat").notNull(),
	instagramUsername: text("instagram_username"),
	websiteUrl: text("website_url"),
	profileImageUrl: text("profile_image_url"),
	creationDate: timestamp("creation_date", { mode: 'string' }).notNull(),
	memberCount: integer("member_count"),
});

export const user = pgTable("user", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
},
(table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const registration = pgTable("registration", {
	id: uuid("id").primaryKey().notNull(),
	runId: uuid("run_id").notNull(),
	userId: uuid("user_id").notNull(),
	registrationDate: timestamp("registration_date", { mode: 'string' }).notNull(),
	status: status("status").default('pending'),
},
(table) => {
	return {
		registrationRunIdRunIdFk: foreignKey({
			columns: [table.runId],
			foreignColumns: [run.id],
			name: "registration_run_id_run_id_fk"
		}),
		registrationUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "registration_user_id_user_id_fk"
		}),
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
	}
});

export const authenticator = pgTable("authenticator", {
	credentialId: text("credentialID").notNull(),
	userId: uuid("userId").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	credentialPublicKey: text("credentialPublicKey").notNull(),
	counter: integer("counter").notNull(),
	credentialDeviceType: text("credentialDeviceType").notNull(),
	credentialBackedUp: boolean("credentialBackedUp").notNull(),
	transports: text("transports"),
},
(table) => {
	return {
		authenticatorUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
		authenticatorUserIdCredentialIdPk: primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
		authenticatorCredentialIdUnique: unique("authenticator_credentialID_unique").on(table.credentialId),
	}
});

export const account = pgTable("account", {
	userId: uuid("userId").notNull(),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});