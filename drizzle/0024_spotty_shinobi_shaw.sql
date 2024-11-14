ALTER TABLE "runs" ADD COLUMN "last_login" timestamp;--> statement-breakpoint
ALTER TABLE "runs" ADD COLUMN "pace" numeric;--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN IF EXISTS "start_time";