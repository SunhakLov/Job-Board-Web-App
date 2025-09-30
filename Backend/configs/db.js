import mysql from "mysql2";

// Use Pool + Promises
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "085583436Hak$$$$",
    database: "jobBoard",
}).promise();

