-- LifeLogs 테이블 생성 (개인 일상 콘텐츠)
CREATE TABLE IF NOT EXISTS "life_logs" (
  "id" SERIAL PRIMARY KEY,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "thumbnail_url" VARCHAR(500),
  "location" VARCHAR(255),
  "visited_at" DATE,
  "rating" INTEGER,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  -- SEO Metadata
  "meta_title" VARCHAR(70),
  "meta_description" VARCHAR(170),
  "og_image" VARCHAR(500),
  "og_title" VARCHAR(100),
  "og_description" VARCHAR(200),
  "canonical_url" VARCHAR(500),
  "no_index" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS "idx_life_logs_category" ON "life_logs" ("category");
CREATE INDEX IF NOT EXISTS "idx_life_logs_is_published" ON "life_logs" ("is_published");
CREATE INDEX IF NOT EXISTS "idx_life_logs_visited_at" ON "life_logs" ("visited_at");
