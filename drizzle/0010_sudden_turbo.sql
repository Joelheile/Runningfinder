ALTER TABLE "club" RENAME COLUMN "avatar_url" TO "avatar";--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "avatar" SET DATA TYPE bytea;