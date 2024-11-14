ALTER TABLE "run" ADD COLUMN "interval" interval NOT NULL;--> statement-breakpoint
ALTER TABLE "run" ADD COLUMN "interval_day" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "club" ADD CONSTRAINT "club_slug_unique" UNIQUE("slug");