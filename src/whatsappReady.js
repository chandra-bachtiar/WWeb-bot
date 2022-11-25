const cron = require("node-cron");
const { resetWelcomingMessage } = require("./middleware/db-command");

const botname = process.env.BOTNAME;
function whatsappReady(client) {
    console.log(`[${botname}] Whatsapp Client is ready!`);

    cron.schedule("59 23 * * *",() => {
        resetWelcomingMessage();
    });
}

module.exports = { whatsappReady };
