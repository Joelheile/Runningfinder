ALTER TABLE "clubs" DROP CONSTRAINT "clubs_avatar_file_id_unique";--> statement-breakpoint
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_avatar_file_id_avatars_id_fk";
--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "avatar_file_id";