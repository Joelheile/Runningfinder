import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  username: text("username").unique(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }),
  lastLogin: timestamp("last_login", { mode: "date" }),
  attendedRuns: integer("attended_runs"),
  image: text("image"),
},
(user) => ({
  idIndex: index("users_id_index").on(user.id),
  emailIndex: index("users_email_index").on(user.email),
})
);

export const avatarTypeEnum = pgEnum("avatarType", ["user", "club"]);
export const avatars = pgTable("avatars", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  img_url: text("img_url").notNull(),
  uploadDate: timestamp("upload_date").notNull(),
  type: avatarTypeEnum("type").notNull(),
});
