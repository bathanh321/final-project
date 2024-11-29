ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_active_lesson_id_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "user_progress" DROP COLUMN IF EXISTS "active_lesson_id";--> statement-breakpoint
ALTER TABLE "user_progress" DROP COLUMN IF EXISTS "challenges";