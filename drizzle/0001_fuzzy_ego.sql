DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('ADMIN', 'STAFF', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'USER' NOT NULL;