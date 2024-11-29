ALTER TABLE "user_progress" ADD COLUMN "active_lesson_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_active_lesson_id_lessons_id_fk" FOREIGN KEY ("active_lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
