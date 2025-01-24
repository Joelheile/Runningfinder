import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { clubs } from "./clubs";
import { users } from "./users";

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
    .references(() => clubs.id),
  date: timestamp("date"),
  interval: text("interval"),
  intervalDay: integer("interval_day"),
  startDescription: text("start_description"),
  locationLng: decimal("location_lng").notNull(),
  locationLat: decimal("location_lat").notNull(),
  mapsLink: text("mapsLink"),
  distance: decimal("distance"),
  temperature: decimal("temperature"),
  wind: decimal("wind"),
  uv_index: decimal("uv_index"),
  membersOnly: boolean("members_only").default(false),
});
