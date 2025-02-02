import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as jwt from "hono/jwt";
import * as argon2 from "argon2";
import { Database } from "bun:sqlite";
import createTable  from "./query/createTable";
import type { LoginRequestType, SignUpRequestType } from "./constants/types";
import insertUser from "./query/insertUser";
import { selectHash } from "./query/selectHash";

const app = new Hono(); // Initialize Hono
app.use(cors());
app.use(logger());
const db = new Database("./src/database/auth.sqlite", {
  // Create sqlite database called "auth" if it doesn't already exist
  create: true,
  strict: true,
});
db.exec("PRAGMA journal_mode = WAL;"); // Enable WAL mode for better performance
createTable(db); // Initialize users table

async function useArgon() {
  const hash = await argon2.hash("password");
  console.log("hash:", hash);
  const verify = await argon2.verify(hash, "password");
  console.log("verify:", verify);
}
const secret = "mySecretKey";

// Routes
app.get("/", (c) => c.text("Hello Bun!"));

/*  
        TODO
        - Check if email is used
        - Create JWT token 
        - Locate password from email
        - Decrypt password
    */
app.post("auth/login", async (c) => {
  const req: LoginRequestType = await c.req.json();
  console.log("login request:", req); 
  const email = req.email;
  const password = req.password;
  const hash = await selectHash(db, email)
  const verify = await argon2.verify(hash, password)
  
  console.log("find hash:", email, hash, verify)

  // const payload = {
  //   sub: 'user123',
  //   role: 'admin',
  //   exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  // }
  // const token = jwt.sign(payload, secret) // Generates a jwt token
  // console.log("token:", token)
  return c.text("Login successful");
});

/*  
        TODO
        - Check if email was used
        - Encrypt password
        - Insert email and encrypted password into users
    */
app.post("auth/signup", async (c) => {
  const req: SignUpRequestType = await c.req.json();
  console.log("sign up request:", req);
  const email = req.email;
  const password = req.password;
  const hash = await argon2.hash(password);

  await insertUser(db, email, hash, "crew" )
  return c.text("Sign up successful");
});

// const hash = await selectHash(db, "crew@pirateship.com")

export default app;
