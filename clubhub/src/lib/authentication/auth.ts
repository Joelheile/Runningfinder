import NextAuth from 'next-auth'






import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '../db/db'
import { accounts, sessions, user, verificationTokens } from '../db/schema'
import Resend from "next-auth/providers/resend"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    //@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
   Resend({
    from: "team@runningfinder.de",
   })
  ],
 
  experimental: { enableWebAuthn: true },    
  })