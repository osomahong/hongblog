CREATE TABLE "content_daily_stats" (
	"content_type" varchar(10) NOT NULL,
	"content_id" integer NOT NULL,
	"date" date NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "content_daily_stats_content_type_content_id_date_pk" PRIMARY KEY("content_type","content_id","date")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faqs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs_to_tags" (
	"faq_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "faqs_to_tags_faq_id_tag_id_pk" PRIMARY KEY("faq_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"highlights" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts_to_tags" (
	"post_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "posts_to_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "faqs_to_tags" ADD CONSTRAINT "faqs_to_tags_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs_to_tags" ADD CONSTRAINT "faqs_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_tags" ADD CONSTRAINT "posts_to_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_tags" ADD CONSTRAINT "posts_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_content_daily_stats_date" ON "content_daily_stats" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_content_daily_stats_content" ON "content_daily_stats" USING btree ("content_type","content_id");