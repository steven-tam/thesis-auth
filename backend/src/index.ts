import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as argon2 from "argon2";
import { Database } from "bun:sqlite";
import createTable from "./query/createTable";
import type { LoginRequestType, SignUpRequestType } from "./constants/types";
import insertUser from "./query/insertUser";
import { selectHash } from "./query/selectHash";
import { sign, verify, decode } from "hono/jwt";
import { getSignedCookie, setSignedCookie, deleteCookie, } from "hono/cookie";

const app = new Hono(); // Initialize Hono
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow the frontend origin
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(logger());

const db = new Database("./src/database/auth.sqlite", {
  // Create sqlite database called "auth" if it doesn't already exist
  create: true,
  strict: true,
});
db.exec("PRAGMA journal_mode = WAL;"); // Enable WAL mode for better performance
createTable(db); // Initialize users table

const JWT_SECRET_SIGNATURE = process.env.JWT_SECRET as string;
const COOKIE_SECRET_SIGNATURE = process.env.COOKIE_SECRET as string;

// Routes
app.get("/", (c) => c.text("Hello Bun!"));

// email: crew@pirateship.com password: 123456
// Cookies cannot be sent with a POST request
app.post("auth/login", async (c) => {
  const req: LoginRequestType = await c.req.json();
  console.log("login request:", req);
  const email = req.email;
  const password = req.password;
  const hash = await selectHash(db, email); // Finds the password hash in database
  const verify: boolean = await argon2.verify(hash, password); // Verifies the password hash

  // const jwtMiddleware = jwt({
  //   secret: jwtSecret,
  //   alg: 'HS256',
  // })
  // console.log("token:", token)

  if (verify) {
    const payload = {
      sub: email,
      role: "crew",
      exp: Math.floor(Date.now() / 1000) + 60 * 1, // Token expires in 5 minutes
    };
    const token = await sign(payload, JWT_SECRET_SIGNATURE); // Generates a jwt token

    await setSignedCookie( // sending cookie with token is good practice
      c,
      "jwt_token_cookie",
      token,
      COOKIE_SECRET_SIGNATURE,
      {
        path: "/",
        secure: true,
        domain: "localhost",
        httpOnly: true,
        maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
        sameSite: "Strict",
      }
    );

    return c.json({ message: "Login successful", token }, 200); // Sends the jwt token
  }
  return c.json({ message: "Invalid email or password" }, 200);
});

app.get("auth/get-cookie", async (c) => {

});
/*  
        TODO
        - Check if email was used
        - Encrypt password
        - Insert email and encrypted password into users
    */
app.post("auth/signup", async (c) => {
  try {
    const req: SignUpRequestType = await c.req.json();
    console.log("sign up request:", req);
    const email = req.email;
    const password = req.password;
    const hash = await argon2.hash(password);
    await insertUser(db, email, hash, "crew");

    return c.json({ message: "Login successful" }, 200);
  } catch (e) {
    console.log("Insert Error", e);
    return c.json({ message: "Email already in use" }, 401);
  }
});

app.get("auth/verify-token", async (c) => {
  const allSignedCookies = await getSignedCookie(c, COOKIE_SECRET_SIGNATURE); // Get JWT from HttpOnly cookie
  try {
    console.log("allSignedCookies:", allSignedCookies);
    const token = allSignedCookies.jwt_token_cookie as string;
    await verify(token, JWT_SECRET_SIGNATURE); // Verify the JWT token

    return c.json({ message: "JWT Token Verified" }, 200);
  } catch (e) {
    deleteCookie(c, "jwt_token_cookie");
    console.log("Insert Error", e);
    return c.json({ message: "Invalid/Missing/Expired JWT Token" }, 401);
  }
});

app.get("auth/logout", async (c) => { 
  await deleteCookie(c, "jwt_token_cookie");
  return c.json({ message: "Logout successful" }, 200);
});
// const hash = await selectHash(db, "crew@pirateship.com")

export default app;
