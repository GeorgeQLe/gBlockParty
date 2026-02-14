import { createDb, type Database } from "@gblockparty/shared/db";

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    db = createDb(url);
  }
  return db;
}
