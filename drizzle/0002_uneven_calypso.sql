ALTER TABLE "challenge_options" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_options" ALTER COLUMN "correct" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "question" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "difficult_level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "is_published" DROP NOT NULL;