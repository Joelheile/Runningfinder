ALTER TABLE "avatar_storage" RENAME COLUMN "creation_date" TO "upload_date";

-- Explicitly cast avatar_file_id to uuid
ALTER TABLE "club" ALTER COLUMN "avatar_file_id" TYPE uuid USING avatar_file_id::uuid;

ALTER TABLE "club" ALTER COLUMN "avatar_file_id" SET NOT NULL;

DO $$ BEGIN
 ALTER TABLE "club" ADD CONSTRAINT "club_avatar_file_id_avatar_storage_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."avatar_storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "club" ADD CONSTRAINT "club_avatar_file_id_unique" UNIQUE("avatar_file_id");