CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"course_id" integer,
	"order_in_course" integer,
	"term" varchar(255) NOT NULL,
	"definition" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"aliases" jsonb,
	"related_terms" jsonb,
	"difficulty" varchar(20),
	"quiz" jsonb,
	"is_published" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"og_image" varchar(500),
	"og_title" varchar(100),
	"og_description" varchar(200),
	"canonical_url" varchar(500),
	"no_index" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "classes_to_tags" (
	"class_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "classes_to_tags_class_id_tag_id_pk" PRIMARY KEY("class_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"thumbnail_url" varchar(500),
	"difficulty" varchar(20),
	"is_published" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"og_image" varchar(500),
	"canonical_url" varchar(500),
	"no_index" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "life_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"thumbnail_url" varchar(500),
	"location" varchar(255),
	"visited_at" date,
	"rating" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"og_image" varchar(500),
	"og_title" varchar(100),
	"og_description" varchar(200),
	"canonical_url" varchar(500),
	"no_index" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "life_logs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "logs_to_tags" (
	"log_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "logs_to_tags_log_id_tag_id_pk" PRIMARY KEY("log_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "seo_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_documents_document_type_unique" UNIQUE("document_type")
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"thumbnail_url" varchar(500),
	"is_published" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(170),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "recommended_year" varchar(50);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "recommended_positions" jsonb;--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "difficulty" varchar(20);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "reference_url" varchar(500);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "reference_title" varchar(255);--> statement-breakpoint
ALTER TABLE "faqs" ADD COLUMN "tech_stack" jsonb;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "quiz" jsonb;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "series_id" integer;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "series_order" integer;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_to_tags" ADD CONSTRAINT "classes_to_tags_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes_to_tags" ADD CONSTRAINT "classes_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_to_tags" ADD CONSTRAINT "logs_to_tags_log_id_life_logs_id_fk" FOREIGN KEY ("log_id") REFERENCES "public"."life_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_to_tags" ADD CONSTRAINT "logs_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_classes_course" ON "classes" USING btree ("course_id","order_in_course");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_posts_series" ON "posts" USING btree ("series_id","series_order");