ALTER TABLE "runs" DROP CONSTRAINT "runs_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;