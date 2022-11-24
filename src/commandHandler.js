const { createSticker, StickerTypes } = require("wa-sticker-formatter");
const { chatType } = require("./chatType");
const { downloadMediaMessage, delay } = require("@adiwajshing/baileys");
const fs = require("fs");
const {
    checkNomor,
    saveNomor,
    updateLastSeen,
    welcomingMessage,
    resetWelcomingMessage,
    insertBarang,
    getDataBarang,
    getSingleDataBarang,
    addIncrement,
} = require("./dbCommand");
const {
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
    onecak,
} = require("./restAPIHandler");

//mysql
const { checkNomorHp } = require('./middleware/db-command');

const { kirimPromosi } = require("./shoppe");
const papa = require("papaparse");

const botname = process.env.BOTNAME;

async function commandHandler(chat, client, message, command) {
    const sendMessageWTyping = async (chat, numberFrom) => {
        await client.presenceSubscribe(numberFrom);
        await delay(500);
        await client.sendPresenceUpdate("composing", numberFrom);
        await delay(2000);
        await client.sendPresenceUpdate("paused", numberFrom);
        await client.sendMessage(numberFrom, chat);
    };

    const msgType = await chatType(chat);
    const from = chat.key.remoteJid || "";
    const nama = chat.pushName || "";

    if (from === "") {
        console.log(`[${botname}] Oops failed get number from!`);
        return;
    }

    //Database validation
    // console.log(msgType);
    if (msgType.type === "protocol" || msgType.type === "protocolImage") {
        let nmr = chat.key.participant || "";
        await saveNomor(nmr, nama);
        await updateLastSeen(nmr);
    } else {
        await saveNomor(from, nama);
        await updateLastSeen(from);

        //add increment
        if(msgType.valid) {
            await addIncrement(from);
            //send ads
            let dataNomor = await checkNomor(from);
            if(dataNomor.increment % 5 == 0) {
                await kirimPromosi(from,client);
            }
        }

        let res = await welcomingMessage(from);
        if (res.isWelcome === false) {
            await client.readMessages([chat.key]);
            const buttons = [
                {
                    buttonId: "about",
                    buttonText: { displayText: "🤖Tentang" },
                    type: 1,
                },
                {
                    buttonId: "menus",
                    buttonText: { displayText: "📃Menus" },
                    type: 1,
                },
                {
                    buttonId: "shopee",
                    buttonText: { displayText: "🛒Racun Shopee" },
                    type: 1,
                },
            ];

            const buttonMessage = {
                image: { url: "./assets/amongus.png" },
                caption: `*[${botname} BOT]*\n*Jangan lupa share ke yg lain ya kak :)*`,
                footerText: "Your Private bot!",
                headerType: 4,
                buttons: buttons,
            };
            await sendMessageWTyping(buttonMessage, from);
        }
    }

    //STICKER
    if (msgType.valid) {
        let caption = Object.values(chat.message)[0].caption || "";

        if (msgType.type == "conversation") {
            caption = Object.values(chat.message)[0];
        } else if (msgType.type == "listRespone") {
            caption = chat.message?.listResponseMessage?.title;
        } else if (msgType.type == "text") {
            caption = chat.message?.extendedTextMessage?.text;
        }

        if (msgType.type === "image" || msgType.type === "video") {
            let stickerType;
            switch (true) {
                case caption.toLowerCase().includes("crop"):
                    stickerType = StickerTypes.CROPPED;
                    break;
                case caption.toLowerCase().includes("full"):
                    stickerType = StickerTypes.FULL;
                    break;
                case caption.toLowerCase().includes("bulat"):
                    stickerType = StickerTypes.CIRCLE;
                    break;
                default:
                    stickerType = StickerTypes.FULL;
                    break;
            }

            const stickerOptions = {
                pack: `[${botname}]`,
                author: "+62 859-1066-03535",
                type: stickerType,
                categories: ["🤩", "🎉"],
                quality: 50,
            };

            const mediaData = await downloadMediaMessage(chat, "buffer", {});
            const generateSticker = await createSticker(
                mediaData,
                stickerOptions
            );
            await client.sendMessage(chat.key.remoteJid, {
                sticker: generateSticker,
            });
        }

        let isHelp = false;
        let helpKeyword = [
            "menu",
            "help",
            "punten",
            "hallo",
            "halo",
            "permisi",
            "bot",
            "bantuan",
            "bantu",
            "hai",
        ];

        for (let i = 0; i < helpKeyword.length; i++) {
            if (caption.toLowerCase().includes(helpKeyword[i])) {
                isHelp = true;
                break;
            }
        }

        if (isHelp) {
            await client.readMessages([chat.key]);
            const buttons = [
                {
                    buttonId: "about",
                    buttonText: { displayText: "🤖Tentang" },
                    type: 1,
                },
                {
                    buttonId: "menus",
                    buttonText: { displayText: "📃Menus" },
                    type: 1,
                },
                {
                    buttonId: "shopee",
                    buttonText: { displayText: "🛒Racun Shopee" },
                    type: 1,
                },
            ];

            const buttonMessage = {
                image: { url: "./assets/amongus.png" },
                caption: `*[${botname} BOT]*\n*Jangan lupa share ke yg lain ya kak :)*`,
                footerText: "Your Private bot!",
                headerType: 4,
                buttons: buttons,
            };
            await sendMessageWTyping(buttonMessage, from);
        }

        //buttons response
        if (msgType.type === "buttonRespone") {
            let id = chat.message?.buttonsResponseMessage?.selectedButtonId;
            if (id == "about" || caption.toLowerCase() == "about") {
                await client.readMessages([chat.key]);
                await sendMessageWTyping(
                    {
                        text: `*${botname}*\nBot yang berfokus pada convert image menjadi sticker, dan berbagai entertaiment lainnya.\n\n version bot : v1.0.0`,
                    },
                    from
                );
            } else if (id == "menus" || caption.toLowerCase() == "menus") {
                await client.readMessages([chat.key]);
                const sections = [
                    {
                        title: "Sticker",
                        rows: [{ title: "Cara buat sticker!" }],
                    },
                    {
                        title: "Fitur Text",
                        rows: [
                            { title: "motivasi" },
                            { title: "bucinquote" },
                            { title: "dilanquote" },
                            { title: "randomquote" },
                            { title: "islamquote" },
                            { title: "senjaquote" },
                            { title: "faktaUnik" },
                            { title: "jawaquote" },
                            { title: "pantun" },
                            { title: "puisi" },
                            { title: "cosplay" },
                        ],
                    },
                    {
                        title: "Fitur Image",
                        rows: [
                            { title: "darkjokes" },
                            { title: "meme" },
                            { title: "memeindo" },
                            { title: "cecan" },
                            { title: "cogan" },
                            { title: "kucing" },
                            { title: "blackpink" },
                        ],
                    },
                ];

                const textMenus = `Silakan klik list dibawah untuk memunculkan semua menu dan feature yang tersedia.`;
                const listMessage = {
                    text: `*[${botname} BOT]*\n` + textMenus,
                    ListType: 2,
                    buttonText: "BOT MENU",
                    sections,
                };
                await sendMessageWTyping(listMessage, from);
            } else if (id == "shopee" || caption.toLowerCase() == "shopee") {
                await kirimPromosi(from,client);
                // await client.readMessages([chat.key]);
                // let barangShopee = await getDataBarang();
                // const sections = [
                //     {
                //         title: "Racun Shopee",
                //         rows: barangShopee.map((brg) => {
                //             return {
                //                 title: brg.nama
                //                     .split(" ")
                //                     .slice(0, 10)
                //                     .join(" "),
                //                 rowId: "shopee" + brg.kode,
                //                 description: brg.harga,
                //             };
                //         }),
                //     },
                // ];
                // const textMenus = `Silakan dipilih kan beberapa barang barang rekomended yang ada di shopee.`;
                // const listMessage = {
                //     text: `*[${botname} BOT]*\n` + textMenus,
                //     ListType: 2,
                //     buttonText: "List Barang",
                //     sections,
                // };
                // await sendMessageWTyping(listMessage, from);
            }
        }

        if (msgType.type == "listRespone") {
            let listID =
                chat.message?.listResponseMessage?.singleSelectReply
                    ?.selectedRowId;
            if (listID.includes("shopee")) {
                let kodeBarang = listID.replace("shopee", "");
                let detailBarang = await getSingleDataBarang(kodeBarang);
                const URLButton = [
                    {
                        index: 1,
                        urlButton: {
                            displayText: "Yuk Checkout💸",
                            url: detailBarang[0].short,
                        },
                    },
                ];

                const templateMessage = {
                    viewOnceMessage: {
                        message: {
                            templateMessage: {
                                hydratedTemplate: {
                                    hydratedContentText: `*${detailBarang[0].nama}*\n\n💰 Harga : ${detailBarang[0].harga}\n📦 Terjual : ${detailBarang[0].terjual}\nYuk di cek barangnya kak rekomended loh.\n*⬇️Klik Tombol dibawah ya kak ⬇️*`,
                                    hydratedButtons: URLButton,
                                },
                            },
                        },
                    },
                };
                await client.relayMessage(from, templateMessage, {});
            }
        }

        switch (true) {
            case caption === "Cara buat sticker!":
                await sendMessageWTyping(
                    {
                        image: { url: "./assets/tutostiker.jpg" },
                        caption:
                            "Kirim Foto tanpa text untuk membuat stiker sesuai foto.",
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("motivasi"):
                let motiv = await motivasi();
                await sendMessageWTyping(
                    {
                        text: motiv,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("bucinquote"):
                let bucin = await bucinquote();
                await sendMessageWTyping(
                    {
                        text: bucin,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("dilanquote"):
                let dilan = await dilanquote();
                await sendMessageWTyping(
                    {
                        text: dilan,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("randomquote"):
                let random = await randomquote();
                await sendMessageWTyping(
                    {
                        text: random,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("senjaquote"):
                let senja = await senjaquote();
                await sendMessageWTyping(
                    {
                        text: senja,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("faktaunik"):
                let fakta = await faktaUnik();
                await sendMessageWTyping(
                    {
                        text: fakta,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("galauquote"):
                let galau = await galauquote();
                await sendMessageWTyping(
                    {
                        text: galau,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("jawaquote"):
                let jawa = await jawaquote();
                await sendMessageWTyping(
                    {
                        text: jawa,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("pantun"):
                let ptn = await pantun();
                await sendMessageWTyping(
                    {
                        text: ptn,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("puisi"):
                let pis = await puisi();
                await sendMessageWTyping(
                    {
                        text: pis,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("islamquote"):
                let islam = await islamquote();
                await sendMessageWTyping(
                    {
                        text: islam,
                    },
                    from
                );
                break;
            case caption.toLowerCase().includes("cosplay"):
                let cosplay = await imagecosplay();
                await sendMessageWTyping({ image: cosplay }, from);
                break;
            case caption.toLowerCase().includes("darkjokes"):
                let darkjokesImg = await darkjokes();
                await sendMessageWTyping({ image: darkjokesImg }, from);
                break;
            case caption.toLowerCase().includes("meme"):
                let memeImg = await meme();
                await sendMessageWTyping({ image: memeImg }, from);
                break;
            case caption.toLowerCase().includes("memeindo"):
                let memeindoImg = await memeindo();
                await sendMessageWTyping({ image: memeindoImg }, from);
                break;
            case caption.toLowerCase().includes("onecak"):
                let onecakImg = await onecak();
                await sendMessageWTyping({ image: onecakImg }, from);
                break;
            case caption.toLowerCase().includes("cogan"):
                let coganImg = await cogan();
                await sendMessageWTyping({ image: coganImg }, from);
                break;
            case caption.toLowerCase().includes("cecan"):
                let cecanImg = await cecan();
                await sendMessageWTyping({ image: cecanImg }, from);
                break;
            case caption.toLowerCase().includes("kucing"):
                let kucingImg = await kucing();
                await sendMessageWTyping({ image: kucingImg }, from);
                break;
            case caption.toLowerCase().includes("blackpink"):
                let blackpinkImg = await blackpink();
                await sendMessageWTyping({ image: blackpinkImg }, from);
                break;
            case caption.toLowerCase().includes("resetwelcomingmessage"):
                await resetWelcomingMessage();
                break;
            case caption.toLowerCase().includes("testing"):
                await checkNomorHp(from);
                break;
            default:
                break;
        }
    } else {
        console.log(msgType);
    }
}

module.exports = { commandHandler };
