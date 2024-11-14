ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "authenticator" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "clubs" ALTER COLUMN "avatar_file_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "avatars" ALTER COLUMN "id" SET DATA TYPE uuid;