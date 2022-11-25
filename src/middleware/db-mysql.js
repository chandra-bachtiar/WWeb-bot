const mysql = require("mysql2/promise");

async function connection() {
    const con = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
    });
    return con;
}


module.exports = { connection };
