import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "../db/db";
import { sendVerificationRequest } from "./sendMailRequest";
import { users } from "../db/schema/users";
import { accounts, sessions, verificationTokens } from "../db/schema/auth";
import Credentials from "next-auth/providers/credentials"

const providers= [
  GitHub,
  Resend({
    apiKey: process.env.NEXT_PUBLIC_AUTH_RESEND_KEY,
    from: "no-reply@runningfinder.de",
    sendVerificationRequest: sendVerificationRequest,
  }),
  Credentials({
       credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
  })
]
if (process.env.NODE_ENV === "development") {
  providers.push(
    Credentials({
      id: "password",
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials.password === process.env.NEXT_PUBLIC_TEST_PASSWORD) {
          return {
            id: "1",
            email: "bob@alice.com",
            name: "Bob Alice",
            image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
          };
        }
        return null;
      },
    })
  );
}


export const { handlers, auth } = NextAuth({
  providers,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

});
