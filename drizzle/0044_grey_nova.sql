ALTER TABLE "runs" ALTER COLUMN "distance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN IF EXISTS "pace";