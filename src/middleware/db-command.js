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
        if (res.length !== 1) {
            errHandler = "Array is less or more than 1";
        }
        return {
            status: 400,
            valid: false,
            error: errHandler,
        };
    }
}

async function saveNomor(nomor, nama) {
    const sql = await connection();
    try {
        let check = await checkNomor(nomor);
        if (!check.valid) {
            let id;
            await sql
                .query(
                    `INSERT INTO NOMOR(NAMA,NOMOR) VALUES ('${nama}','${nomor}');`
                )
                .then((res) => {
                    if (res[0].affectedRows > 0) {
                        id = res[0].insertId;
                    }
                })
                .finally(() => sql.end());
            return {
                status: 200,
                valid: true,
                data: {
                    id: id,
                },
                message: "Contact Number inserted!",
            };
        } else {
            await sql.end();
            return {
                status: 400,
                valid: false,
                message: "Contact already registered",
            };
        }
    } catch (error) {
        console.log(error);
        await sql.end();
        return {
            status: 400,
            valid: false,
            message: error,
        };
    }
}

module.exports = {
    checkNomor,
    saveNomor,
};
