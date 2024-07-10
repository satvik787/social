import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";


let db = null;

export async function getDB(){
    if(db === null){
        await connectDB();
    }
    return db;
}

export default async function connectDB(){
    if(db === null) {

        const poolConnection = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            port: 3306,
            database: "discord"
        });
        db = drizzle(poolConnection);
    }
    return db;
}

