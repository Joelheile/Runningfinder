
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  bio: text("bio"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  lastLogin: timestamp("last_login"),
  attendedRuns: integer("attended_runs"),
  image: text("image"),
});

export const avatars = pgTable("avatars", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  img_url: text("img_url").notNull(),
  uploadDate: timestamp("upload_date").notNull(),
});
