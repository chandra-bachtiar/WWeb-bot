const pool = require('./db-mysql');

async function checkNomorHp(nomor) {
    pool.query("SELECT * FROM NOMOR LIMIT 100", function(err,row,fields) {
        console.log(row);
    });
}

module.exports = {
    checkNomorHp
}