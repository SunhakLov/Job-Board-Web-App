import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("ENV CHECK:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? "****" : undefined,
    database: process.env.DB_NAME
});

// Use Pool + Promises
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

const [data] = await pool.query("SELECT * FROM tests");

console.log(data)
