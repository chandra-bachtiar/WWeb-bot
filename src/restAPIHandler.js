const axios = require("axios");
const APIKEY = process.env.APIKEY;

async function motivasi() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/motivasi?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function dilanquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/dilanquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function bucinquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/bucinquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function senjaquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/katasenja?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function randomquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/randomquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function galauquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/galauquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function islamquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/muslimquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function jawaquote() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/jawaquote?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function faktaUnik() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/faktaunik?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function pantun() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/pantun?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function puisi() {
    let res = await axios
        .get(`https://zenzapis.xyz/randomtext/puisi?apikey=${APIKEY}`)
        .then((res) => res.data)
        .then((res) => {
            if (res.status == "OK") {
                return res.result.message;
            } else {
                return false;
            }
        })
        .catch((err) => console.log(err));
    return res;
}

async function imagecosplay() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/cosplay?apikey=${APIKEY}`
    );
}

async function darkjokes() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/darkjoke?apikey=${APIKEY}`
    );
}

async function meme() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/meme?apikey=${APIKEY}`
    );
}

async function memeindo() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/memeindo?apikey=${APIKEY}`
    );
}

async function onecak() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/onecak?apikey=${APIKEY}`
    );
}

async function blackpink() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/blackpink?apikey=${APIKEY}`
    );
}

async function cecan() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/cecan?apikey=${APIKEY}`
    );
}

async function cogan() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/cogan?apikey=${APIKEY}`
    );
}

async function kucing() {
    return await getBuffer(
        `https://zenzapis.xyz/randomimage/kucing?apikey=${APIKEY}`
    );
}

const getBuffer = async (url, options) => {
    try {
        options ? options : {};
        const res = await axios({
            method: "get",
            url,
            headers: {
                DNT: 1,
                "Upgrade-Insecure-Request": 1,
            },
            ...options,
            responseType: "arraybuffer",
        });
        return res.data;
    } catch (e) {
        console.log(`Error : ${e}`);
    }
};

module.exports = {
    motivasi,
    bucinquote,
    dilanquote,
    randomquote,
    senjaquote,
    faktaUnik,
    galauquote,
    jawaquote,
    pantun,
    puisi,
    islamquote,
    imagecosplay,
    darkjokes,
    blackpink,
    cecan,
    cogan,
    kucing,
    memeindo,
    meme,
    onecak
};
