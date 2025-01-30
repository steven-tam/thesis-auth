import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Database } from "bun:sqlite"
import { logger } from 'hono/logger'

// Initialize Hono
const app = new Hono()
app.use(cors())
app.use(logger())

// Initialize Database
const db = new Database("users.sqlite", { // Create sqlite database called "users" if it doesn't already exist
    create: true, 
    strict: true,
})
db.exec("PRAGMA journal_mode = WAL;"); // Enables WAL mode for better performance

app.get('/', (c) => c.text('Hello Bun!'))

app.post('auth/login', async (c) => {
    return c.text("Login successful")
})

app.post('auth/signup', async (c) => {
    return c.text("Sign up successful")
})

/*
Default Port: 3000


*/

export default app
