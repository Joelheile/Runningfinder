ALTER TABLE "club" RENAME COLUMN "location" TO "location_lng";--> statement-breakpoint
ALTER TABLE "run" RENAME COLUMN "location" TO "location_lang";--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "location_lng" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "run" ALTER COLUMN "location_lang" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "location_lat" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "run" ADD COLUMN "location_lat" numeric NOT NULL;