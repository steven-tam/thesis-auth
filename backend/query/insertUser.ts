import { Database } from "bun:sqlite";

type UserType = {
  db: Database;
  email: string;
  password: string;
  role: string;
};

export default async function insertUser({db, email, password, role}: UserType) {
    try{
        const newUser = `INSERT INTO user (email, password, role) VALUES (${email}, ${password}, ${role})`
        const insertUser = await db.prepare(newUser);
        await insertUser.run()
    }
    catch (e){
        console.log("Email must be unqiue;", e)
    }
}
