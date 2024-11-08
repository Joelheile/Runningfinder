import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import { db } from "../db/db";

export const { handlers, auth } = NextAuth({ 
  adapter: DrizzleAdapter(db),
  providers: [GitHub] });
