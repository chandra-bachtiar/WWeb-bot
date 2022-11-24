const mysql = require("mysql2/promise");

async function connection() {
    const con = await mysql.createConnection({
        // host: process.env.MYSQL_HOST,
        // user: process.env.MYSQL_USER,
        // password: process.env.MYSQL_PASSWORD,
        // database: process.env.MYSQL_DB,
        // waitForConnections: true,
        // connectionLimit: process.env.MYSQL_CON_LIMIT,
        host: "103.176.78.64",
        user: "root",
        password: "404:NotFound",
        database: "BOT",
    });
    return con;
}


module.exports = { connection };
