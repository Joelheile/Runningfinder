ALTER TABLE "file_storage" RENAME TO "avatar_storage";--> statement-breakpoint
ALTER TABLE "club" DROP CONSTRAINT "club_avatar_file_id_file_storage_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club" ADD CONSTRAINT "club_avatar_file_id_avatar_storage_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."avatar_storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
