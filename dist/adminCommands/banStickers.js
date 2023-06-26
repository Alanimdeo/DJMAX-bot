"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
module.exports = new types_1.Command(new discord_js_1.SlashCommandBuilder().setName("banstickers").setDescription("스티커 사용 금지"), async (message, bot) => {
    let [_, __, subcommand, ...args] = message.content.split(" ");
    const banStickers = bot.config.get("banStickers");
    if (subcommand === "list") {
        const stickers = banStickers.names.map((sticker) => String(sticker));
        await message.reply("`" + stickers.join("`, `") + "`");
    }
    else if (subcommand === "add") {
        const sticker = args[0];
        banStickers.names.push(new RegExp(sticker));
        bot.config.set("banStickers", banStickers);
        await message.react("✅");
    }
    else if (subcommand === "remove") {
        const sticker = args[0];
        banStickers.names = banStickers.names.filter((name) => name.source !== sticker);
        bot.config.set("banStickers", banStickers);
        await message.react("✅");
    }
});
