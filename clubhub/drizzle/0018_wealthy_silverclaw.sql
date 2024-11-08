CREATE TABLE IF NOT EXISTS "auth_verificationNumberSessions" (
	"verificationNumber" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_verificationNumberSessions_userId_createdAt_pk" PRIMARY KEY("userId","createdAt")
);
--> statement-breakpoint
ALTER TABLE "auth_authenticator" RENAME COLUMN "credentialID" TO "credentialId";--> statement-breakpoint
ALTER TABLE "run" RENAME COLUMN "location_lang" TO "location_lng";--> statement-breakpoint
ALTER TABLE "auth_authenticator" DROP CONSTRAINT "auth_authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "auth_authenticator" DROP CONSTRAINT "auth_authenticator_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_authenticator" DROP CONSTRAINT "auth_authenticator_userId_credentialID_pk";--> statement-breakpoint
ALTER TABLE "auth_account" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "auth_authenticator" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "auth_session" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_authenticator" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_verificationNumberSessions" ADD CONSTRAINT "auth_verificationNumberSessions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_authenticator" ADD CONSTRAINT "auth_authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Authenticator_credentialID_key" ON "auth_authenticator" USING btree ("credentialId");