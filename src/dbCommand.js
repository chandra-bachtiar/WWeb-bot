const { mongodb } = require("./db");
const botname = process.env.BOTNAME;

async function checkNomor(nomor) {
    let rgx = new RegExp(`^.*${nomor.replace("@s.whatsapp.net", "")}.*$`, "i");
    // console.log(rgx);
    let res = await mongodb
        .collection("HP")
        .find({
            nomor: rgx,
        })
        .toArray();
    if (res.length > 0) {
        res[0].status = 200;
        res[0].valid = true;
        return res[0];
    } else {
        return { valid: false };
    }
}

async function saveNomor(nomor, nama) {
    let check = await checkNomor(nomor);
    if (check.valid) {
        // console.log(
        //     `[${botname}] Nomor ${nomor.replace(
        //         "@s.whatsapp.net",
        //         ""
        //     )} sudah terdaftar! An ${check.nama}`
        // );
    } else {
        try {
            await mongodb.collection("HP").insertOne({
                nomor: nomor,
                nama: nama,
            });
            console.log(
                `[${botname}-Register] ${nomor.replace(
                    "@s.whatsapp.net",
                    ""
                )} => ${nama}`
            );
        } catch (err) {
            console.log(err);
        }
    }
}

async function addIncrement(nomor) {
    let check = await checkNomor(nomor);
    let rgx = new RegExp(`^.*${nomor.replace("@c.us","").replace("@s.whatsapp.net", "")}.*$`, "i");
    if(check.valid) {
        try {
            await mongodb.collection("HP").updateOne({
                nomor: rgx
            },{
                $inc: {
                    increment: 1,
                }
            })
        } catch(err) {
            console.log(err)
        }
    }
}

async function updateLastSeen(nomor) {
    let check = await checkNomor(nomor);
    let rgx = new RegExp(`^.*${nomor.replace("@c.us","").replace("@s.whatsapp.net", "")}.*$`, "i");
    if (check.valid) {
        try {
            await mongodb.collection("HP").updateOne(
                {
                    nomor: rgx,
                },
                {
                    $set: {
                        lastSeen: +new Date(),
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
}

async function resetWelcomingMessage() {
    try {
        await mongodb
            .collection("HP")
            .updateMany(
                {},
                {
                    $set: {
                        isWelcome: false,
                    },
                }
            )
            .then((res) => console.log(res));
    } catch (err) {
        console.log(err);
    }
}

async function welcomingMessage(nomor) {
    let check = await checkNomor(nomor);
    let rgx = new RegExp(`^.*${nomor.replace("@s.whatsapp.net", "")}.*$`, "i");
    if (check.valid) {
        try {
            // check welcoming message
            if (check?.isWelcome === false) {
                await mongodb.collection("HP").updateOne(
                    {
                        nomor: rgx,
                    },
                    {
                        $set: {
                            isWelcome: true,
                        },
                    }
                );
                return { status: 200, isWelcome: false };
            } else {
                return { status: 200, isWelcome: true };
            }
        } catch (err) {
            console.log(err);
        }
    }
}

async function insertBarang(arr) {
    try {
        let inputBarang = await mongodb.collection("SHOPE").insertMany(arr);
        console.log(inputBarang);
    } catch(err) {
        console.log(err);
    }
}

async function getDataBarang() {
    try {
        return await mongodb.collection("SHOPE").find({}).toArray();
    } catch(err) {
        return false;
    }
}

async function getSingleDataBarang(kode) {
    try {
        return await mongodb.collection("SHOPE").find({kode: kode}).toArray();
    } catch(err) {
        return false;
    }
}

module.exports = {
    checkNomor,
    saveNomor,
    updateLastSeen,
    resetWelcomingMessage,
    welcomingMessage,
    insertBarang,
    getDataBarang,
    getSingleDataBarang,
    addIncrement
};
