ALTER TABLE "users" RENAME COLUMN "image" TO "avatar_file_id";--> statement-breakpoint
ALTER TABLE "avatars" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar_file_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_avatar_file_id_avatars_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."avatars"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_file_id_unique" UNIQUE("avatar_file_id");