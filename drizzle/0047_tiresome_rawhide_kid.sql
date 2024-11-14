ALTER TABLE "runs" RENAME COLUMN "last_login" TO "start_time";--> statement-breakpoint
ALTER TABLE "runs" ALTER COLUMN "start_time" SET DATA TYPE text;