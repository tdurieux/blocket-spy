const TelegramBot = require("node-telegram-bot-api");
console.log("Token", process.env.TELEGRAM_TOKEN);
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
let chatId = -438649481;

function sendMessage(message, ad) {
  if (ad.uploads.length > 0) {
    bot.sendPhoto(chatId, ad.uploads[0].url, {
      caption: message.substring(0, 1023),
      parse_mode: "markdown",
    });
  } else {
    bot.sendMessage(chatId, message, { parse_mode: "markdown" });
  }
}

module.exports = ({ results, url }) => {
  for (let ad of results) {
    const address = `${ad.location.route} ${ad.location.streetNumber} ${ad.location.locality} ${ad.location.postalCode}`;
    const description = ad.description_en ? ad.description_en : ad.description;
    sendMessage(
      `[${ad.roomCount} Room, ${ad.squareMeters}m2, ${
        ad.rent
      } SEK](${url}) ([direction](https://www.google.com/maps?saddr=${encodeURIComponent(
        address
      )}&daddr=KTH+ENTRE))\n${description}`,
      ad
    );
  }
};
