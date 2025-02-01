import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import createTable from "./query/createTable";
import { Database } from "bun:sqlite";

// Initialize Hono
const app = new Hono();
app.use(cors());
app.use(logger());

// Create sqlite database called "auth" if it doesn't already exist
const db = new Database("auth.sqlite", {
  create: true,
  strict: true,
});
// Enable WAL mode for better performance
db.exec("PRAGMA journal_mode = WAL;");

// Initialize users table
createTable(db);

app.get("/", (c) => c.text("Hello Bun!"));

    /*  
        TODO
        - Check if email is used
        - Create JWT token 
        - Locate password from email
        - Decrypt password
    */
app.post("auth/login", async (c) => {
  const req = await c.req.json();
  console.log("login request:", req);
  return c.text("Login successful");
});


    /*  
        TODO
        - Check if email was used
        - Encrypt password
        - Insert email and encrypted password into users
    */
app.post("auth/signup", async (c) => {
  const req = await c.req.json();
  console.log("sign up request:", req);

  return c.text("Sign up successful");
});

export default app;
