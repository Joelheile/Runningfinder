ALTER TABLE "club" ADD COLUMN "location" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "run" ADD COLUMN "location" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "club" DROP COLUMN IF EXISTS "position_lng";--> statement-breakpoint
ALTER TABLE "club" DROP COLUMN IF EXISTS "position_lat";--> statement-breakpoint
ALTER TABLE "run" DROP COLUMN IF EXISTS "position_lang";--> statement-breakpoint
ALTER TABLE "run" DROP COLUMN IF EXISTS "position_lat";