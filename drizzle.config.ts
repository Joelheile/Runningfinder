import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
const isTesting = process.env.NEXT_PUBLIC_TESTING === "true";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    url: isTesting ? process.env.DB_DEV! : process.env.DB_PROD!,
  },
});
