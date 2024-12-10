import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as localDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({ path: ".env.local" });

const isTesting = process.env.NEXT_PUBLIC_TESTING === "true";
const databaseUrl = isTesting
  ? process.env.NEXT_PUBLIC_DB_DEV
  : process.env.NEXT_PUBLIC_DB_PROD;

let db: any;

if (isTesting) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  db = localDrizzle(pool);
} else {
  const sql = neon(databaseUrl!);
  db = neonDrizzle(sql);
}

export { db };
