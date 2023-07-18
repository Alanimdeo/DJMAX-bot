import { Message } from "discord.js";
import { Bot, SecretChat } from "../types";

export async function secretChatHandler(bot: Bot, message: Message, secretChat: SecretChat) {
  setTimeout(async () => {
    try {
      await message.delete();
    } catch (_) {
      // Do nothing!
    }
  }, secretChat.duration);
  const logChannelId = bot.config.get("logChannelId");
  if (!logChannelId) {
    return;
  }
  const logChannel = bot.guilds.cache.get(secretChat.guildId)?.channels.cache.get(logChannelId);
  if (!logChannel || !logChannel.isTextBased()) {
    return;
  }

  await logChannel.send({
    files: Array.from(message.attachments.values()),
    embeds: Array.from(message.embeds.values()),
    content: `**${message.member?.nickname || message.author.username}**(${message.author.id}) > ${message.content}${
      message.stickers.size ? "Sticker: [" + message.stickers.map((sticker) => sticker.name).join(", ") + "]" : ""
    }`,
  });
}
