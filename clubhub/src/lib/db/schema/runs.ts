import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  decimal,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";

export const statusEnum = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const registrations = pgTable("registrations", {
  id: text("id").primaryKey().notNull(),
  runId: text("run_id")
    .notNull()
    .references(() => runs.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  registrationDate: timestamp("registration_date").notNull(),
  status: statusEnum("status").default("pending"),
});

export const intervalEnum = pgEnum("interval", [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
]);

export const runs = pgTable("runs", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  difficulty: text("difficulty"),
  clubId: text("club_id")
    .notNull()
    .references(() => clubs.id),
  date: timestamp("date").notNull(),
  interval: intervalEnum("interval").notNull(),
  intervalDay: integer("interval_day").notNull(),
  startDescription: text("start_description").notNull(),
  startTime: timestamp("last_login", { mode: "date" }),
  locationLng: decimal("location_lng").notNull(),
  locationLat: decimal("location_lat").notNull(),
  distance: decimal("distance"),
  temperature: decimal("temperature"),
  wind: decimal("wind"),
  uv_index: decimal("uv_index"),
  membersOnly: boolean("members_only").default(false),
});
