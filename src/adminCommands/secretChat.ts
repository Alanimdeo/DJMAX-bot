import { Message, SlashCommandBuilder } from "discord.js";
import { Bot, Command, SecretChat } from "../types";

module.exports = new Command(
  new SlashCommandBuilder().setName("secretchat").setDescription("비밀 채팅방"),
  async (message: Message, bot: Bot) => {
    function checkExistingSecretChat(channelId: string) {
      return bot.config
        .get("secretChat")
        .some((secretChat) => secretChat.channelId === channelId);
    }

    let [_, __, subcommand, ...args] = message.content.split(" ");
    if (subcommand === "create") {
      if (checkExistingSecretChat(args[0])) {
        await message.reply("이미 존재하는 비밀 채팅방입니다.");
        return;
      }
      const logChannelId = args.length === 3 ? args[2] : undefined;
      createSecretChat(args[0], Number(args[1]));
      await message.react("✅");
    }
    if (subcommand === "delete") {
      if (!checkExistingSecretChat(args[0])) {
        await message.reply("존재하지 않는 비밀 채팅방입니다.");
        return;
      }
      deleteSecretChat(args[0]);
      await message.react("✅");
    }

    function createSecretChat(channelId: string, duration: number) {
      const secretChat = bot.config.get("secretChat");
      secretChat.push({ guildId: message.guildId!, channelId, duration });
      bot.config.set("secretChat", secretChat);
    }

    function deleteSecretChat(channelId: string) {
      const secretChat = bot.config.get("secretChat");
      bot.config.set(
        "secretChat",
        secretChat.filter((secretChat) => secretChat.channelId !== channelId)
      );
    }
  }
);
