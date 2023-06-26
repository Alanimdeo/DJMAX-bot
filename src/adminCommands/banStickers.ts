import { Message, SlashCommandBuilder } from "discord.js";
import { Bot, Command } from "../types";

module.exports = new Command(
  new SlashCommandBuilder().setName("banstickers").setDescription("스티커 사용 금지"),
  async (message: Message, bot: Bot) => {
    let [_, __, subcommand, ...args] = message.content.split(" ");
    const banStickers = bot.config.get("banStickers");
    if (subcommand === "list") {
      const stickers = banStickers.names.map((sticker) => String(sticker));
      await message.reply("`" + stickers.join("`, `") + "`");
    } else if (subcommand === "add") {
      const sticker = args[0];
      banStickers.names.push(new RegExp(sticker));
      bot.config.set("banStickers", banStickers);
      await message.react("✅");
    } else if (subcommand === "remove") {
      const sticker = args[0];
      banStickers.names = banStickers.names.filter((name) => name.source !== sticker);
      bot.config.set("banStickers", banStickers);
      await message.react("✅");
    }
  }
);
