ALTER TABLE "lessons" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "is_published" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "is_published" DROP NOT NULL;