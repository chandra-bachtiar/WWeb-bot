const {
    pengeluaran,
    getRekap,
    deleteRow,
    pemasukan,
    getAkunKas,
    pindahKas,
} = require("./worksheet.js");
const { delay } = require("@adiwajshing/baileys");
const dotenv = require("dotenv");
dotenv.config();

const namaMaster = [process.env.NAMAMASTER, process.env.NAMAMASTER2];

async function commandCustom(chat, client, master) {
    const JENIS = [
        "JAJAN",
        "KESEHATAN",
        "BENSIN",
        "SHOPEE",
        "KUOTA",
        "MAKAN",
        "AMAL",
        "CICILAN",
        "JASA",
        "SANDANG",
        "OBAT",
        "KOSAN"
    ];

    const numberFrom = chat.key.remoteJid || "";
    const nama =
        numberFrom.replace("@s.whatsapp.net", "") === master[0]
            ? namaMaster[0]
            : namaMaster[1];
    const caption = chat?.message?.extendedTextMessage?.text || chat?.message?.conversation || "";

    const sendMessageWTyping = async (chat, numberFrom) => {
        await client.presenceSubscribe(numberFrom);
        await delay(500);
        await client.sendPresenceUpdate("composing", numberFrom);
        await delay(2000);
        await client.sendPresenceUpdate("paused", numberFrom);
        await client.sendMessage(numberFrom, chat);
    };

    if (caption.includes("#pengeluaran")) {
        console.log("test");
        try {
            const jenisnya = caption.split(" ")[1];
            const nominal = caption.split(" ")[2];
            const keterangan = caption.split(" ").slice(3).join(" ");
            if (!JENIS.includes(jenisnya.toUpperCase())) {
                await sendMessageWTyping(
                    { text: "Jenis pengeluaran tidak ditemukan" },
                    numberFrom
                );
                await sendMessageWTyping(
                    { text: "#jenis untuk melihat semua jenis pengeluaran!" },
                    numberFrom
                );
                return;
            }
            pengeluaran(nominal, nama, jenisnya, keterangan);
            await sendMessageWTyping(
                { text: "Pengeluaran Berhasil ditambahkan, Terima Kasih." },
                numberFrom
            );
        } catch (error) {
            console.log(error);
        }
    }

    if (caption.includes("#pemasukan")) {
        const kode = caption.split(" ")[1];
        const nominal = caption.split(" ")[2];
        const keterangan = caption.split(" ").slice(3).join(" ");
        pemasukan(kode, keterangan, nominal);
        await sendMessageWTyping(
            { text: "Pemasukan Berhasil ditambahkan, Terima Kasih." },
            numberFrom
        );
    }

    if (caption.includes("#transfer")) {
        const dariAkun = caption.split(" ")[1];
        const keAkun = caption.split(" ")[2];
        const nominal = caption.split(" ")[3];
        const keterangan = caption.split(" ").slice(4).join(" ");
        pindahKas(dariAkun, keAkun, nominal, keterangan);
        await sendMessageWTyping(
            { text: "Pindah Kas Berhasil ditambahkan, Terima Kasih." },
            numberFrom
        );
    }

    if (caption.includes("#kas")) {
        let res = await getAkunKas();
        let text = "*KAS*\n";
        text += " - - - - - - - - - -\n";
        let total = 0;
        for (let i = 0; i < res.length; i++) {
            const el = res[i];
            total += parseInt(el[3]);
            text += `*${el[0]}* - ${el[1]} - ${el[2]} \n======> Rp. *${parseInt(
                el[3]
            ).toLocaleString("id-ID")}*\n`;
        }
        text += " - - - - - - - - - -\n";
        text += `*SUBTOTAL : Rp. ${parseInt(total).toLocaleString("id-ID")}*`;
        await sendMessageWTyping({ text: text }, numberFrom);
    }

    if (caption.includes("#detail")) {
        let res = await getRekap();
        let barisData = res.data.values.slice(2);
        let bulan = caption.split(" ")[1];
        let tahun = caption.split(" ")[2];

        if (bulan === undefined || tahun === undefined) {
            msg.reply("Harus ada format bulan dan tahun!");
            return;
        }

        let kirimDetail = sendDetail(barisData, nama, bulan, tahun, numberFrom);
        await sendMessageWTyping({ text: kirimDetail }, numberFrom);
    }

    if (caption.includes("#hapus")) {
        let id = parseInt(caption.split(" ")[1]) || 0;
        if (id === undefined || id === 0) {
            msg.reply("ID Tidak ditemukan!");
            return;
        }
        let hapus = await deleteRow(id);
        if (hapus.status === 200) {
            await sendMessageWTyping({ text: hapus.message }, numberFrom);
        } else {
            await sendMessageWTyping({ text: hapus.message }, numberFrom);
        }
    }

    if (caption.includes("#jenis")) {
        await sendMessageWTyping({ text: JENIS.join("\n") }, numberFrom);
    }
}

function sendDetail(result, nama, bulan, tahun) {
    let text = `*Detail Pengeluaran*\n`;
    let hasilData = result.filter(
        (res) =>
            parseInt(res[6]) == bulan &&
            parseInt(res[7]) == tahun &&
            res[2] == nama
    );
    console.log(hasilData);
    let total = 0;
    let ke = 0;
    let tanggal = "";
    hasilData.forEach((res) => {
        ke++;
        if (res[1] !== tanggal) {
            tanggal = res[1];
            text += `\n*${tanggal}*\n`;
            text += `==============\n`;
            text += `*[ ${res[0]} ]* ${res[5]} => Rp. ${parseInt(
                res[3]
            ).toLocaleString("id-ID")}\n`;
        } else {
            text += `*[ ${res[0]} ]* ${res[5]} => Rp. ${parseInt(
                res[3]
            ).toLocaleString("id-ID")}\n`;
        }
        total += parseInt(res[3]);
    });

    text += `======================= + \n`;
    text += `*Total Pengeluaran : Rp. ${total.toLocaleString("id-ID")}*`;
    return text;
}

module.exports = { commandCustom };
