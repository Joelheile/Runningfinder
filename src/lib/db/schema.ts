import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v4 } from "uuid";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }),
  lastLogin: timestamp("last_login", { mode: "date" }),
  attendedRuns: integer("attended_runs"),
  image: text("image"),
  isAdmin: boolean("is_admin").default(false),
});

export const avatarTypeEnum = pgEnum("avatarType", ["user", "club"]);
export const avatars = pgTable("avatars", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  img_url: text("img_url").notNull(),
  uploadDate: timestamp("upload_date").notNull(),
  type: avatarTypeEnum("type").notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compound_key: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    composite_pk: primaryKey(
      verificationToken.identifier,
      verificationToken.token,
    ),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialId: text("credential_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    composite_pk: primaryKey(authenticator.userId, authenticator.credentialId),
  }),
);

export const statusEnum = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const roleEnum = pgEnum("role", ["member", "admin", "manager"]);

export const registrations = pgTable("registrations", {
  id: text("id").primaryKey().notNull(),
  runId: text("run_id")
    .notNull()
    .references(() => runs.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  registrationDate: timestamp("registration_date"),
  status: text("status"),
});

export const runs = pgTable("runs", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  difficulty: text("difficulty"),
  clubId: text("club_id")
    .notNull()
    .references(() => clubs.id, { onDelete: "cascade" }),
  datetime: timestamp("datetime"),
  weekday: integer("weekday"),
  startDescription: text("start_description"),
  locationLng: decimal("location_lng", { precision: 10, scale: 6 }),
  locationLat: decimal("location_lat", { precision: 10, scale: 6 }),
  mapsLink: text("mapsLink"),
  isRecurrent: boolean("is_recurrent"),
  isApproved: boolean("is_approved"),
  distance: text("distance"),
});

export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    clubId: text("club_id")
      .notNull()
      .references(() => clubs.id),
    joinDate: timestamp("join_date").notNull(),
    status: statusEnum("status").default("pending"),
    role: roleEnum("role").default("member"),
  },
  (membership) => ({
    userIdIndex: index("membership_user_id_index").on(membership.userId),
    clubIdIndex: index("membership_club_id_index").on(membership.clubId),
  }),
);

export const clubs = pgTable("clubs", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  instagramUsername: text("instagram_username"),
  stravaUsername: text("strava_username"),
  websiteUrl: text("website_url"),
  avatarUrl: text("avatar_url"),
  isApproved: boolean("is_approved"),
  creationDate: timestamp("creation_date").notNull(),
});
