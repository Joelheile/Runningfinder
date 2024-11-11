import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend"
import { db } from "../db/db";
import {  sendVerificationRequest } from "./sendMailRequest";
import { users } from "../db/schema/users";
import { accounts, sessions, verificationTokens } from "../db/schema/auth";


export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [GitHub, Resend({
    apiKey: process.env.NEXT_PUBLIC_AUTH_RESEND_KEY,
    from: "team@runningfinder.de",
    sendVerificationRequest: sendVerificationRequest
  })],
});
