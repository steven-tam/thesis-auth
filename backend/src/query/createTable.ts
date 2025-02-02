import { Database } from "bun:sqlite";

export default async function createTable(db: Database) {
  // Query outside of function to prevent SQL injection
  const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT
        );
    `;
  const insertAdmin = `INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)`;

  // Creates users table
  const table = await db.query(createTable);
  await table.run();

  // Adds admin user
  const admin = await db.query(insertAdmin);
  await admin.run('captain@pirateship.com','testing123', 'captain');
}