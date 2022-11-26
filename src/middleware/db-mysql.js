const chalk = require("chalk");
const mysql = require("mysql2/promise");

const notify = (fun) => {
    console.log(chalk.green("[DB] ") + fun);
}

notify("Creating mysql pool . . .")
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: 10,
});

pool.on("connection", function (con) {
    notify("Connection Established")

    con.on("error", function (err) {
        console.log(err);
    });

    con.on("close", function (err) {
        console.error(new Date(), "MySQL close", err);
    });
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    notify("Connected!")
    connection.release();
});

module.exports = pool;
