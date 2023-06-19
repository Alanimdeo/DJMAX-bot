"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretChatHandler = void 0;
async function secretChatHandler(bot, message, secretChat) {
    setTimeout(async () => {
        try {
            await message.delete();
        }
        catch (_) {
            // Do nothing!
        }
    }, secretChat.duration);
    if (!secretChat.logChannelId) {
        return;
    }
    const logChannel = bot.guilds.cache.get(secretChat.guildId)?.channels.cache.get(secretChat.logChannelId);
    if (!logChannel || !logChannel.isTextBased()) {
        return;
    }
    await logChannel.send({
        files: Array.from(message.attachments.values()),
        embeds: Array.from(message.embeds.values()),
        content: `**${message.member?.nickname || message.author.username}**(${message.author.id}) > ${message.content}`,
    });
}
exports.secretChatHandler = secretChatHandler;
