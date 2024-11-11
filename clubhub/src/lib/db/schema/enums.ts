import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "pending",
  "active",
  "deactivated",
  "banned",
]);

export const intervalEnum = pgEnum("interval", [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
]);