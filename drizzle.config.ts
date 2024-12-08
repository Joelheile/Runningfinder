import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
const isTesting = process.env.NEXT_PUBLIC_TESTING === "true";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema",
  dbCredentials: {
    url: isTesting
      ? process.env.NEXT_PUBLIC_DB_DEV!
      : process.env.NEXT_PUBLIC_DB_PROD!,
  },
});
