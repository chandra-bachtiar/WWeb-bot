const { connection } = require("./db-mysql");

async function checkNomor(nomor) {
    const sql = await connection();
    let errHandler;
    const res = await sql
        .query(`SELECT * FROM NOMOR WHERE NOMOR LIKE '%${nomor}%'`)
        .then(([rows]) => {
            return rows;
        })
        .catch((err) => {
            let errHandler = {
                code: err.errno,
                message: err.sqlMessage,
            };
            console.log(errHandler);
        })
        .finally(() => sql.end());

    if (Array.isArray(res) && res.length == 1) {
        return {
            status: 200,
            valid: true,
            data: res[0],
        };
    } else {
        if(res.length !== 1) {
            errHandler = "Array is less or more than 1";
        }
        return {
            status: 400,
            valid: false,
            error : errHandler,
        }
    }
}

module.exports = {
    checkNomor,
};
