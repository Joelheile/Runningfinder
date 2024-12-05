import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
const isProdMode = process.env.NEXT_PUBLIC_TESTING === "false";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema",
  dbCredentials: {
    url: isProdMode ? process.env.NEXT_PUBLIC_DB_PROD! : process.env.NEXT_PUBLIC_DB_DEV!,
  },
});
