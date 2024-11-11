DROP TABLE "avatars";--> statement-breakpoint
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_avatar_file_id_unique";--> statement-breakpoint
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_avatar_file_id_avatars_id_fk";
--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN IF EXISTS "avatar_file_id";