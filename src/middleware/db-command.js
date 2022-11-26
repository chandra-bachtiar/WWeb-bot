const chalk = require("chalk");
const sql = require("./db-mysql");

const parseNomor = (nomor) =>
    nomor.replace("@c.us", "").replace("@s.whatsapp.net", "");

const notify = (fun) => {
    console.log(chalk.green("[DB] ") + "Release on " + fun);
}

async function checkNomor(nomor) {
    let errHandler;
    const res = await sql
        .query(`SELECT * FROM NOMOR WHERE NOMOR LIKE '%${parseNomor(nomor)}%'`)
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
        .finally(() => notify("checkNomor"));
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

async function saveNomor(nomor, nama, check) {
    try {
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
                .finally(() => notify("saveNomor"));
            return {
                status: 200,
                valid: true,
                data: {
                    id: id,
                },
                message: "Contact Number inserted!",
            };
        } else {
            return {
                status: 400,
                valid: false,
                message: "Contact already registered",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            valid: false,
            message: error,
        };
    }
}

async function addIncrement(nomor,check) {
    try {
        if (check.valid) {
            await sql
                .query(
                    `UPDATE NOMOR
                    SET TOTAL_HIT = TOTAL_HIT + 1
                    WHERE NOMOR LIKE '%${parseNomor(nomor)}%';`
                )
                .finally(() => notify("addIncrement"));
            return {
                status: 200,
                valid: true,
                message: "Increment Added",
            };
        } else {
            return {
                status: 400,
                valid: false,
                message: "Contact Not registered",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            valid: false,
            message: error,
        };
    }
}

async function updateLastSeen(nomor, check) {
    try {
        if (check.valid) {
            await sql
                .query(
                    `UPDATE NOMOR
                    SET LAST_SEEN = '${+new Date()}'
                    WHERE NOMOR LIKE '%${parseNomor(nomor)}%';`
                )
                .finally(() => notify("updateLastSeen"));
            return {
                status: 200,
                valid: true,
                message: "Last seen Change",
            };
        } else {
            return {
                status: 400,
                valid: false,
                message: "Contact Not registered",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            valid: false,
            message: error,
        };
    }
}

async function resetWelcomingMessage() {
    try {
        let res = await sql
            .query(`UPDATE NOMOR SET WELCOMING = 0`)
            .finally(() => notify("resetWelcomingMessage"));
        return {
            status: 200,
            valid: true,
            data: {
                affected: res[0].affectedRows,
            },
            message: "Welcoming Reseted",
        };
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            valid: false,
            message: error,
        };
    }
}

async function welcomingMessage(nomor,check) {
    try {
        if (check.valid) {
            if (check.data.WELCOMING == 0) {
                await sql
                    .query(
                        `UPDATE NOMOR
                    SET WELCOMING = 1
                    WHERE NOMOR LIKE '%${parseNomor(nomor)}%';`
                    )
                    .finally(() => notify("welcomingMessage"));

                return {
                    status: 200,
                    isWelcome: false,
                };
            } else {
                return {
                    status: 200,
                    isWelcome: true,
                };
            }
        } else {
            return {
                status: 400,
                valid: false,
                message: "Contact Not registered",
            };
        }
    } catch (error) {
        console.log(error);
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
    addIncrement,
    updateLastSeen,
    resetWelcomingMessage,
    welcomingMessage,
};
