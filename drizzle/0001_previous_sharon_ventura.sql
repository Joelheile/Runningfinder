DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('member', 'admin', 'manager');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "authenticator" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "membership" ALTER COLUMN "join_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "membership" ALTER COLUMN "status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "registration" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "run" ALTER COLUMN "club_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "membership" ADD COLUMN "role" "role" DEFAULT 'member';