import { pgTable, text, timestamp, integer, foreignKey, numeric, index, interval, primaryKey, boolean, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const avatarType = pgEnum("avatarType", ['user', 'club'])
export const interval = pgEnum("interval", ['daily', 'weekly', 'biweekly', 'monthly'])
export const role = pgEnum("role", ['member', 'admin', 'manager'])
export const status = pgEnum("status", ['pending', 'active', 'deactivated', 'banned'])



export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	bio: text("bio"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	attendedRuns: integer("attended_runs"),
	name: text("name"),
});

export const clubs = pgTable("clubs", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	locationLng: numeric("location_lng").notNull(),
	instagramUsername: text("instagram_username"),
	websiteUrl: text("website_url"),
	avatarFileId: text("avatar_file_id").notNull(),
	creationDate: timestamp("creation_date", { mode: 'string' }).notNull(),
	memberCount: integer("member_count"),
	locationLat: numeric("location_lat").notNull(),
	slug: text("slug").notNull(),
},
(table) => {
	return {
		clubsAvatarFileIdAvatarsIdFk: foreignKey({
			columns: [table.avatarFileId],
			foreignColumns: [avatars.id],
			name: "clubs_avatar_file_id_avatars_id_fk"
		}),
	}
});

export const memberships = pgTable("memberships", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	clubId: text("club_id").notNull(),
	joinDate: timestamp("join_date", { mode: 'string' }).notNull(),
	status: status("status").default('pending'),
	role: role("role").default('member'),
},
(table) => {
	return {
		membershipClubIdIdx: index("membership_club_id_index").using("btree", table.clubId.asc().nullsLast()),
		membershipUserIdIdx: index("membership_user_id_index").using("btree", table.userId.asc().nullsLast()),
		membershipsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "memberships_user_id_users_id_fk"
		}),
		membershipsClubIdClubsIdFk: foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "memberships_club_id_clubs_id_fk"
		}),
	}
});

export const runs = pgTable("runs", {
	id: text("id").primaryKey().notNull(),
	clubId: text("club_id").notNull(),
	date: timestamp("date", { mode: 'string' }).notNull(),
	startDescription: text("start_description").notNull(),
	locationLng: numeric("location_lng").notNull(),
	distance: numeric("distance").notNull(),
	temperature: numeric("temperature"),
	wind: numeric("wind"),
	uvIndex: numeric("uv_index"),
	locationLat: numeric("location_lat").notNull(),
	interval: interval("interval").notNull(),
	intervalDay: integer("interval_day").notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	pace: numeric("pace"),
},
(table) => {
	return {
		runsClubIdClubsIdFk: foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "runs_club_id_clubs_id_fk"
		}),
	}
});

export const registrations = pgTable("registrations", {
	id: text("id").primaryKey().notNull(),
	runId: text("run_id").notNull(),
	userId: text("user_id").notNull(),
	registrationDate: timestamp("registration_date", { mode: 'string' }).notNull(),
	status: status("status").default('pending'),
},
(table) => {
	return {
		registrationsRunIdRunsIdFk: foreignKey({
			columns: [table.runId],
			foreignColumns: [runs.id],
			name: "registrations_run_id_runs_id_fk"
		}),
		registrationsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "registrations_user_id_users_id_fk"
		}),
	}
});

export const avatars = pgTable("avatars", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	imgUrl: text("img_url").notNull(),
	uploadDate: timestamp("upload_date", { mode: 'string' }).notNull(),
	type: avatarType("type").notNull(),
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_userId_users_id_fk"
		}).onDelete("cascade"),
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
	userId: text("userId").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	credentialPublicKey: text("credentialPublicKey").notNull(),
	counter: integer("counter").notNull(),
	credentialDeviceType: text("credentialDeviceType").notNull(),
	credentialBackedUp: boolean("credentialBackedUp").notNull(),
	transports: text("transports"),
},
(table) => {
	return {
		authenticatorUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "authenticator_userId_users_id_fk"
		}).onDelete("cascade"),
		authenticatorUserIdCredentialIdPk: primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull(),
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
		accountUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_userId_users_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});