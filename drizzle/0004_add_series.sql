-- 시리즈 테이블 생성
CREATE TABLE IF NOT EXISTS "series" (
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

-- posts 테이블에 시리즈 관련 컬럼 추가
ALTER TABLE "posts" ADD COLUMN "series_id" integer;
ALTER TABLE "posts" ADD COLUMN "series_order" integer;

-- 외래키 제약조건 추가
ALTER TABLE "posts" ADD CONSTRAINT "posts_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS "idx_posts_series" ON "posts" ("series_id", "series_order");
