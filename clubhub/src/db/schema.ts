import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  date,
  uuid,
  index,
  time,
  doublePrecision,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import { float } from "drizzle-orm/mysql-core";

//TODO: schema in different files

const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

//

export const users = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

// authentication using auth.js

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

// Registration table

export const statusEnum = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const registrations = pgTable("registration", {
  id: uuid("id").primaryKey().notNull(),
  runId: uuid("run_id")
    .notNull()
    .references(() => runs.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  registrationDate: timestamp("registration_date").notNull(),
  status: statusEnum("status").default("pending"),
});

export const roleEnum = pgEnum("role", [
  "member",
  "admin",
  "manager",
]);


// Membership table
export const memberships = pgTable(
  "membership",
  {
    id: uuid("id").primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id),
    joinDate: timestamp("join_date").notNull(),
    status: statusEnum("status").default("pending"),
    role: roleEnum("role").default("member"),
  },
  (membership) => ({
    userIdIndex: index("membership_user_id_index").on(membership.userId),
    clubIdIndex: index("membership_club_id_index").on(membership.clubId),
  })
);

// Run table
export const runs = pgTable("run", {
  id: uuid("id").primaryKey().notNull(),
  clubId: uuid("club_id")
    .notNull()
    .references(() => clubs.id),
  date: date("date").notNull(),
  startDescription: text("start_description").notNull(),
  startTime: time("start_time").notNull(),
  positionLang: decimal("position_lang").notNull(),
  positionLat: decimal("position_lat").notNull(),
  distance: decimal("distance").notNull(),
  temperature: decimal("temperature"),
  wind: decimal("wind"),
  uv_index: decimal("uv_index"),
});

// Club table
export const clubs = pgTable("club", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  positionLang: decimal("position_lang").notNull(),
  positionLat: decimal("position_lat").notNull(),
  instagramUsername: text("instagram_username"),
  websiteUrl: text("website_url"),
  profileImageUrl: text("profile_image_url"),
  creationDate: timestamp("creation_date").notNull(),
  memberCount: integer("member_count"),
});
