import {
	boolean,
	foreignKey,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";

export const avatarType = pgEnum("avatarType", ["user", "club"]);
export const role = pgEnum("role", ["member", "admin", "manager"]);
export const status = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const session = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey().notNull(),
    userId: text("userId").notNull(),
    expires: timestamp("expires", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      sessionUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "session_userId_users_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").notNull(),
    clubId: text("club_id").notNull(),
    joinDate: timestamp("join_date", { mode: "string" }).notNull(),
    status: status("status").default("pending"),
    role: role("role").default("member"),
  },
  (table) => {
    return {
      membershipClubIdIdx: index("membership_club_id_index").using(
        "btree",
        table.clubId.asc().nullsLast(),
      ),
      membershipUserIdIdx: index("membership_user_id_index").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      membershipsUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "memberships_user_id_users_id_fk",
      }),
      membershipsClubIdClubsIdFk: foreignKey({
        columns: [table.clubId],
        foreignColumns: [clubs.id],
        name: "memberships_club_id_clubs_id_fk",
      }),
    };
  },
);

export const registrations = pgTable(
  "registrations",
  {
    id: text("id").primaryKey().notNull(),
    runId: text("run_id").notNull(),
    userId: text("user_id").notNull(),
    registrationDate: timestamp("registration_date", { mode: "string" }),
    status: text("status"),
  },
  (table) => {
    return {
      registrationsUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "registrations_user_id_users_id_fk",
      }),
      registrationsRunIdRunsIdFk: foreignKey({
        columns: [table.runId],
        foreignColumns: [runs.id],
        name: "registrations_run_id_runs_id_fk",
      }),
    };
  },
);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    bio: text("bio"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    lastLogin: timestamp("last_login", { mode: "string" }),
    attendedRuns: integer("attended_runs"),
    image: text("image"),
  },
  (table) => {
    return {
      usersEmailUnique: unique("users_email_unique").on(table.email),
    };
  },
);

export const clubs = pgTable(
  "clubs",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    locationLng: numeric("location_lng").notNull(),
    locationLat: numeric("location_lat").notNull(),
    instagramUsername: text("instagram_username"),
    stravaUsername: text("strava_username"),
    websiteUrl: text("website_url"),
    avatarFileId: text("avatar_file_id"),
    creationDate: timestamp("creation_date", { mode: "string" }).notNull(),
    memberCount: integer("member_count"),
  },
  (table) => {
    return {
      clubsAvatarFileIdAvatarsIdFk: foreignKey({
        columns: [table.avatarFileId],
        foreignColumns: [avatars.id],
        name: "clubs_avatar_file_id_avatars_id_fk",
      }),
      clubsSlugUnique: unique("clubs_slug_unique").on(table.slug),
      clubsAvatarFileIdUnique: unique("clubs_avatar_file_id_unique").on(
        table.avatarFileId,
      ),
    };
  },
);

export const avatars = pgTable("avatars", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  imgUrl: text("img_url").notNull(),
  uploadDate: timestamp("upload_date", { mode: "string" }).notNull(),
  type: avatarType("type").notNull(),
});

export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    difficulty: text("difficulty"),
    clubId: text("club_id").notNull(),
    date: timestamp("date", { mode: "string" }),
    interval: text("interval"),
    intervalDay: integer("interval_day"),
    startDescription: text("start_description"),
    locationLng: numeric("location_lng").notNull(),
    locationLat: numeric("location_lat").notNull(),
    distance: numeric("distance"),
    temperature: numeric("temperature"),
    wind: numeric("wind"),
    uvIndex: numeric("uv_index"),
    membersOnly: boolean("members_only").default(false),
    mapsLink: text("mapsLink"),
  },
  (table) => {
    return {
      runsClubIdClubsIdFk: foreignKey({
        columns: [table.clubId],
        foreignColumns: [clubs.id],
        name: "runs_club_id_clubs_id_fk",
      }),
    };
  },
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenPk: primaryKey({
        columns: [table.identifier, table.token],
        name: "verificationToken_identifier_token_pk",
      }),
    };
  },
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialId: text("credential_id").notNull(),
    userId: text("user_id").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports"),
  },
  (table) => {
    return {
      authenticatorUserIdUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "authenticator_userId_users_id_fk",
      }).onDelete("cascade"),
      authenticatorUserIdCredentialIdPk: primaryKey({
        columns: [table.credentialId, table.userId],
        name: "authenticator_user_id_credential_id_pk",
      }),
      authenticatorCredentialIdUnique: unique(
        "authenticator_credential_id_unique",
      ).on(table.credentialId),
    };
  },
);

export const account = pgTable(
  "account",
  {
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
        name: "account_userId_users_id_fk",
      }).onDelete("cascade"),
      accountProviderProviderAccountIdPk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_provider_providerAccountId_pk",
      }),
    };
  },
);
