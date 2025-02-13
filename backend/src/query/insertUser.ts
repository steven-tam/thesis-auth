import { Database } from "bun:sqlite";

export default async function insertUser(db: Database, email: string, hash: string, role: string) {
    const query = `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`;
    const insertUser = await db.prepare(query);
    await insertUser.run(email, hash, role);
}
