import { Database} from "bun:sqlite"


export default async function createTable (db: Database) {
    // Enables WAL mode for better performance
    db.exec("PRAGMA journal_mode = WAL;"); 
    
    // Query outside of function to prevent SQL injection
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT
        );
    `
    const insertAdmin = `INSERT OR IGNORE INTO users (email, password, role) VALUES ('admin@example.com', '123456', 'admin')`
    
    // Creates users table
    const table = await db.query(createTable);
    await table.run();

    // Adds admin user
    const admin = await db.query(insertAdmin)
    await admin.run();
}