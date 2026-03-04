import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function main() {
  const postId = parseInt(process.argv[2]);
  if (!postId) {
    console.error("Usage: npx tsx scripts/publish-post.ts <post-id>");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const result = await db
    .update(posts)
    .set({ isPublished: true })
    .where(eq(posts.id, postId))
    .returning({ id: posts.id, title: posts.title, isPublished: posts.isPublished });

  if (result.length === 0) {
    console.error(`포스트 ID ${postId}를 찾을 수 없습니다.`);
    process.exit(1);
  }

  console.log(`✅ 발행 완료: ID ${result[0].id} — ${result[0].title}`);
  process.exit(0);
}

main();
