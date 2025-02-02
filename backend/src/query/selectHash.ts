import { Database } from "bun:sqlite";

type HashType = {
    password_hash: string
}
export async function selectHash(db: Database, email: string){
    const query = `SELECT password_hash FROM users WHERE email = ?`;
    const hashQuery = await db.prepare(query);
    const result = await hashQuery.get(email) as HashType; // Execute the query and get the result
    return result ? result.password_hash : "";
}