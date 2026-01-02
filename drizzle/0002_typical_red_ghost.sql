ALTER TABLE "faqs" ADD COLUMN "meta_title" varchar(70);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "meta_description" varchar(170);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "og_image" varchar(500);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "focus_keyword" varchar(100);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "canonical_url" varchar(500);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "no_index" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "meta_title" varchar(70);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "meta_description" varchar(170);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "og_image" varchar(500);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "og_title" varchar(100);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "og_description" varchar(200);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "focus_keyword" varchar(100);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "canonical_url" varchar(500);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "no_index" boolean DEFAULT false;