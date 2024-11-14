CREATE TABLE IF NOT EXISTS "file_storage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"img_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "club" RENAME COLUMN "avatar" TO "avatar_file_id";--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "avatar_file_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "avatar_file_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club" ADD CONSTRAINT "club_avatar_file_id_file_storage_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."file_storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
