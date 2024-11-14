ALTER TABLE "runs" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "runs" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "runs" ALTER COLUMN "interval" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "runs" ALTER COLUMN "interval_day" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "runs" ALTER COLUMN "start_description" DROP NOT NULL;