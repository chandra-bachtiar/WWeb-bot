// const axios = require("axios");
const fetch = require("node-fetch-commonjs");
const { prepareWAMessageMedia } = require("@adiwajshing/baileys");
const pino = require("pino");
const crypto = require("crypto-js");

const appId = process.env.SHOPEID;
const secret = process.env.SHOPESECRET;
const keyword = [
    "",
    "baju",
    "kemeja pria",
    "kemeja wanita",
    "tas wanita",
    "tas pria",
    "celana wanita",
    "celana pria",
    "kacamata",
    "sepatu wanita",
    "sepatu pria",
    "sandal",
    "kalung",
    "gelang",
    "buku",
    "sabun",
];

async function kirimPromosi(nomor, client) {
    let randomKeyword = parseInt(Math.random() * (keyword.length + 1));
    let selectedKeyword = keyword[randomKeyword];
    let query = {
        query: `{productOfferV2(listType: 1, matchId: 0, keyword: "${selectedKeyword}", sortType: 1, limit: 20){nodes{itemId commissionRate commission price sales imageUrl shopName offerLink productName periodStartTime periodEndTime}}}`,
        variables: null,
        operationName: null,
    };
    let dataApi = await callAPI(query);
    let dataApiUse = dataApi
        .filter((x) => x.sales > 0)
        .sort((a, b) => parseInt(b.commission) - parseInt(a.commission))[0];

    const formatNumber = (number) =>
        number.toLocaleString("id-ID", { minimumFractionDigits: 0 });
    try {
        const URLButton = [
            {
                index: 1,
                urlButton: {
                    displayText: "Yuk Checkout💸",
                    url: dataApiUse.offerLink,
                },
            },
        ];

        const templateMessage = {
            viewOnceMessage: {
                message: {
                    templateMessage: {
                        hydratedTemplate: {
                            hydratedContentText: `*${
                                dataApiUse.productName
                            }*\n\n💰 Harga : *Rp. ${formatNumber(
                                parseInt(dataApiUse.price)
                            )}*\n📦 Terjual : ${formatNumber(
                                parseInt(dataApiUse.sales)
                            )} PCS\n\nYuk di cek barangnya kak rekomended loh.\n*⬇️Klik Tombol dibawah ya kak ⬇️*\n🔗Link Produk : ${dataApiUse.offerLink}`,
                            hydratedButtons: URLButton,
                        },
                    },
                },
            },
        };

        templateMessage.viewOnceMessage.message.templateMessage.hydratedTemplate =
            Object.assign(
                templateMessage.viewOnceMessage.message.templateMessage
                    .hydratedTemplate,
                await prepareWAMessageMedia(
                    { image: { url: dataApiUse.imageUrl } },
                    {
                        logger: pino({ level: "silent" }),
                        userJid: client.user.id,
                        upload: client.waUploadToServer,
                    }
                )
            );
        await client.sendMessage(nomor, {
            text: "*Iklan Dulu kak bentar yaa*",
        });
        await client.relayMessage(nomor, templateMessage, {});
    } catch (err) {
        console.log(err);
    }
}

async function callAPI(query) {
    let payload = JSON.stringify(query);
    let ts = Math.ceil(new Date().getTime() / 1000);
    let factor = appId + ts + payload + secret;
    let sign = crypto.SHA256(factor).toString(crypto.enc.Hex);

    let headers = {
        "Content-Type": "application/json",
        Authorization:
            "SHA256 Credential=" +
            appId +
            ", Timestamp=" +
            ts +
            ", Signature=" +
            sign,
    };

    const res = await fetch("https://open-api.affiliate.shopee.co.id/graphql", {
        method: "post",
        headers: headers,
        body: payload,
        credentials: "include",
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (responseBody) {
            try {
                return JSON.parse(responseBody);
            } catch (error) {
                return responseBody;
            }
        });
    return res.data?.productOfferV2?.nodes;
}

module.exports = {
    kirimPromosi,
};
