import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

async function addIsPublishedColumn() {
  try {
    // Check if column exists in posts
    const postsCheck = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'posts' AND column_name = 'is_published'
    `);
    
    if (postsCheck.rows.length === 0) {
      await db.execute(sql`
        ALTER TABLE "posts" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL
      `);
      console.log("Added is_published column to posts table");
    } else {
      console.log("is_published column already exists in posts table");
    }

    // Check if column exists in faqs
    const faqsCheck = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'faqs' AND column_name = 'is_published'
    `);
    
    if (faqsCheck.rows.length === 0) {
      await db.execute(sql`
        ALTER TABLE "faqs" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL
      `);
      console.log("Added is_published column to faqs table");
    } else {
      console.log("is_published column already exists in faqs table");
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

addIsPublishedColumn();
