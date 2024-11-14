DO $$ BEGIN
 CREATE TYPE "public"."avatarType" AS ENUM('user', 'club');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "avatars" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"img_url" text NOT NULL,
	"upload_date" timestamp NOT NULL,
	"type" "avatarType" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "avatar_file_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clubs" ADD CONSTRAINT "clubs_avatar_file_id_avatars_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."avatars"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_avatar_file_id_unique" UNIQUE("avatar_file_id");