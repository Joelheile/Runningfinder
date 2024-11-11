import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  decimal,
  text,
  integer,
  boolean,
  time,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { clubs } from "./clubs";
import { intervalEnum, statusEnum } from "./enums";


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



export const runs = pgTable("runs", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  difficulty: text("difficulty"),
  clubId: text("club_id")
    .notNull()
    .references(() => clubs.id),
  date: timestamp("date"),
  interval: intervalEnum("interval"),
  intervalDay: integer("interval_day"),
  startDescription: text("start_description"),
  startTime: text("start_time"),
  locationLng: decimal("location_lng").notNull(),
  locationLat: decimal("location_lat").notNull(),
  distance: decimal("distance"),
  temperature: decimal("temperature"),
  wind: decimal("wind"),
  uv_index: decimal("uv_index"),
  membersOnly: boolean("members_only").default(false),
});
