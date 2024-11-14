ALTER TABLE "registrations" ALTER COLUMN "registration_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "status" DROP DEFAULT;