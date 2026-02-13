import { neon, Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleHttp, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

type AnyDb = NeonHttpDatabase<typeof schema> | NeonDatabase<typeof schema>;

let _db: AnyDb | null = null;

function isCliContext(): boolean {
  return typeof process !== "undefined" && !!process.argv?.[1] && !process.env.NEXT_RUNTIME;
}

export const db = new Proxy({} as AnyDb, {
  get(_target, prop) {
    if (!_db) {
      if (isCliContext()) {
        const ws = require("ws");
        neonConfig.webSocketConstructor = ws;
        const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
        _db = drizzleWs(pool, { schema });
      } else {
        const sql = neon(process.env.DATABASE_URL!);
        _db = drizzleHttp(sql, { schema });
      }
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
