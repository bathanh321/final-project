CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"token" text,
	"expires" timestamp,
	CONSTRAINT "password_reset_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "unique_email_token_index";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_email_reset_token_index" ON "password_reset_token" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_email_verification_token_index" ON "verification_token" USING btree ("email","token");