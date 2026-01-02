ALTER TABLE "faqs" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "faqs" DROP COLUMN "focus_keyword";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "focus_keyword";