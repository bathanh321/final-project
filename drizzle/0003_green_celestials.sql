ALTER TABLE "user_progress" ADD COLUMN "challenges" jsonb DEFAULT '[]'::jsonb NOT NULL;