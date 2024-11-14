DO $$ BEGIN
 CREATE TYPE "public"."avatarType" AS ENUM('user', 'club');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "avatars" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "avatars" ADD COLUMN "type" "avatarType" NOT NULL;