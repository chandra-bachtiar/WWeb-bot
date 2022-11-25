"use strinct";
const {
    default: makeWASocket,
    AnyMessageContent,
    MessageType,
    delay,
    downloadMediaMessage,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    MessageRetryMap,
    useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const { join } = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
console.log("Starting . . .");

//local package
const { commandHandler } = require("./src/commandHandler");
const { commandCustom } = require("./src/commandCustom");
const { whatsappReady } = require("./src/whatsappReady");
const { exec } = require("child_process");

const master_ = process.env.HPMASTER;
const master__ = process.env.HPMASTER2;
const master___ = process.env.HPMASTER3;
const master = [master_, master__, master___];
const botname = process.env.BOTNAME;
console.log("Mastering This Session. . .");
console.table(master);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(
        "baileys_auth_info"
    );
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: "silent" }),
    });

    sock.ev.on("call", async (node) => {
        const { from, id, status } = node[0];
        if (status == "offer") {
            const stanza = {
                tag: "call",
                attrs: {
                    from: sock.user.id,
                    to: from,
                    id: sock.generateMessageTag(),
                },
                content: [
                    {
                        tag: "reject",
                        attrs: {
                            "call-id": id,
                            "call-creator": from,
                            count: "0",
                        },
                        content: undefined,
                    },
                ],
            };
            await sock.query(stanza).then( async (res) => {
                console.log("Telfon dari = " + from);
                await sock.sendMessage(from, {
                    text: `*[WARNING] Jangan Telfon ya*`,
                });
            });
        }
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession) {
                console.log(
                    `Bad Session File, Please Delete Session and Scan Again`
                );
                sock.logout();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startBot();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                startBot();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(
                    "Connection Replaced, Another New Session Opened, Please Close Current Session First"
                );
                sock.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Scan Again And Run.`);
                sock.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                startBot();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                startBot();
            } else
                sock.end(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
        if (connection == "connecting") {
            console.log(`[${botname}] Please wait . . . `);
        }
        if (connection == "open") {
            whatsappReady(sock);
        }
    });

    sock.ev.process(async (events) => {
        if (events["creds.update"]) {
            await saveCreds();
        }

        if (events["messages.upsert"]) {
            const upsert = events["messages.upsert"];
            console.log(upsert);
            const kerjaan = [
                "6281121111537",
                "6281121111538",
                "6281121111539",
                "6281111122914",
                "6281121111536",
            ];
            if (upsert.type === "notify") {
                try {
                    for (const msg of upsert.messages) {
                        const numberFrom = msg.key.remoteJid || "";
                        if (
                            kerjaan.includes(
                                numberFrom.replace("@s.whatsapp.net", "")
                            )
                        ) {
                            console.log("kerjaan");
                        } else {
                            if (!numberFrom) {
                                console.log(
                                    `[${botname}-index] Oops failed get number from!`
                                );
                                return;
                            }
                            await commandHandler(msg, sock);
                            if (
                                master.includes(
                                    numberFrom.replace("@s.whatsapp.net", "")
                                )
                            ) {
                                await commandCustom(msg, sock, master);
                            }
                        }
                    }
                } catch (e) {
                    console.log("Catch Error : " + e);
                }
            }
        }
    });
    return sock;
}

startBot();
