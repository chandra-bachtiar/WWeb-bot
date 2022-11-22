async function chatType(msg) {
    try {
        if (msg.key.fromMe === false) {
            const tipe = Object?.keys(msg?.message)[0] || false;
            switch (tipe) {
                case "imageMessage":
                    return { type: "image", media: true, valid: true };
                case "extendedTextMessage":
                    return { type: "text", media: false, valid: true };
                case "conversation":
                    return { type: "conversation", media: false, valid: true };
                case "videoMessage":
                    return { type: "video", media: true, valid: true };
                case "stickerMessage":
                    return { type: "sticker", media: true, valid: true };
                case "documentMessage":
                    return { type: "document", media: false, valid: true };
                case "audioMessage":
                    return { type: "audio", media: false, valid: true };
                case "locationMessage":
                    return { type: "location", media: false, valid: true };
                case "contantMessage":
                    return { type: "contact", media: false, valid: true };
                case "protocolMessage":
                    return { type: "protocol", media: false, valid: true };
                case "senderKeyDistributionMessage":
                    return { type: "protocolImage", media: false, valid: true };
                case "messageContextInfo":
                    let jenis = Object?.keys(msg.message)[1];
                    if(jenis == 'listResponseMessage') {
                        return { type: "listRespone", media: false, valid: true };
                    } else {
                        return { type: "buttonRespone", media: false, valid: true };
                    }
                default:
                    console.log(msg);
                    return { type: "Unknow", valid: false };
            }
        } else {
            return { type: "fromME", media: false, valid: false };
        }
    } catch (err) {
        console.log(msg)
        return { type: "Unknow", valid: false };
    }
    
}

module.exports = { chatType };
