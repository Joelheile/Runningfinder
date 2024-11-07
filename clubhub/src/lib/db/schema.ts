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
  decimal,
  pgEnum,

  uniqueIndex,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";

import { v4 } from "uuid";

const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationNumberSessions = pgTable(
  'verificationNumberSessions',
  {
    verificationNumber: text('verificationNumber').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.createdAt] }),
    }
  },
)

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

export const Authenticator = pgTable(
  'authenticator',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => v4()),
    credentialID: text('credentialId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    userIdIdx: uniqueIndex('Authenticator_credentialID_key').on(authenticator.credentialID),
  }),
)

export const statusEnum = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const registration = pgTable("registration", {
  id: uuid("id").primaryKey().notNull(),
  runId: uuid("run_id")
    .notNull()
    .references(() => run.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  registrationDate: timestamp("registration_date").notNull(),
  status: statusEnum("status").default("pending"),
});

export const roleEnum = pgEnum("role", ["member", "admin", "manager"]);
export const membership = pgTable(
  "membership",
  {
    id: uuid("id").primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    clubId: uuid("club_id")
      .notNull()
      .references(() => club.id),
    joinDate: timestamp("join_date").notNull(),
    status: statusEnum("status").default("pending"),
    role: roleEnum("role").default("member"),
  },
  (membership) => ({
    userIdIndex: index("membership_user_id_index").on(membership.userId),
    clubIdIndex: index("membership_club_id_index").on(membership.clubId),
  }),
);

const intervalEnum = pgEnum("interval", ["daily", "weekly", "biweekly", "monthly"]);

export const run = pgTable("run", {
  id: uuid("id").primaryKey().notNull(),
  clubId: uuid("club_id")
    .notNull()
    .references(() => club.id),
  date: date("date").notNull(),
  interval: intervalEnum("interval").notNull(),
  intervalDay: integer("interval_day").notNull(),
  startDescription: text("start_description").notNull(),
  startTime: time("start_time").notNull(),
  locationLng: decimal("location_lng").notNull(),
  locationLat: decimal("location_lat").notNull(),
  distance: decimal("distance").notNull(),
  temperature: decimal("temperature"),
  wind: decimal("wind"),
  uv_index: decimal("uv_index"),
});

export const club = pgTable("club", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  locationLng: decimal("location_lng").notNull(),
  locationLat: decimal("location_lat").notNull(),
  instagramUsername: text("instagram_username"),
  websiteUrl: text("website_url"),
  avatarFileId: uuid("avatar_file_id")
    .notNull()
    .unique()
    .references(() => avatarStorage.id),
  creationDate: timestamp("creation_date").notNull(),
  memberCount: integer("member_count"),
});

export const avatarStorage = pgTable("avatar_storage", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name"),
  img_url: text("img_url").notNull(),
  uploadDate: timestamp("upload_date").notNull(),
});
