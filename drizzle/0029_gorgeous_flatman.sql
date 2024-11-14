ALTER TABLE "users" RENAME COLUMN "avatar_file_id" TO "image";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_avatar_file_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_avatar_file_id_avatars_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" DROP NOT NULL;

ALTER TABLE users
ALTER TABLE avatars ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;