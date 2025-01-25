import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { db } from "../db/db";
import { accounts, sessions, users, verificationTokens } from "../db/schema";

import { sendVerificationRequest } from "./sendMailRequest";

const providers = [
  GitHub,
  Resend({
    apiKey: process.env.NEXT_PUBLIC_AUTH_RESEND_KEY,
    from: "no-reply@runningfinder.de",
    sendVerificationRequest: sendVerificationRequest,
  }),
];

export const { handlers, auth } = NextAuth({
  providers,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
});
