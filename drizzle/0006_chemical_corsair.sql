CREATE TABLE "linkedin_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_urn" varchar(255) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"access_token_expires_at" timestamp NOT NULL,
	"refresh_token_expires_at" timestamp,
	"scopes" varchar(500),
	"linkedin_name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "linkedin_posted_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "linkedin_posted_at" timestamp;