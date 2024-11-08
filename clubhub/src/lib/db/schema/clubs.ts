
import { pgTable, uuid, timestamp, pgEnum, decimal, text, integer, index } from "drizzle-orm/pg-core";
import { avatars, users } from "./users";
import { statusEnum } from "./runs";

export const roleEnum = pgEnum("role", ["member", "admin", "manager"]);

export const memberships = pgTable(
  "memberships",
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
  }),
);

export const clubs = pgTable("clubs", {
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
    .references(() => avatars.id),
  creationDate: timestamp("creation_date").notNull(),
  memberCount: integer("member_count"),
});
