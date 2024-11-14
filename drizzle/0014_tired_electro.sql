ALTER TABLE "club" DROP CONSTRAINT "club_avatar_file_id_unique";--> statement-breakpoint
ALTER TABLE "club" DROP CONSTRAINT "club_avatar_file_id_avatar_storage_id_fk";
--> statement-breakpoint
ALTER TABLE "avatar_storage" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "avatar_file_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "avatar_storage" ADD COLUMN "creation_date" timestamp NOT NULL;