ALTER TABLE "clubs" ADD COLUMN "is_approved" boolean;--> statement-breakpoint
ALTER TABLE "runs" ADD COLUMN "is_approved" boolean;--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "member_count";--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN "temperature";--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN "wind";--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN "uv_index";--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN "members_only";