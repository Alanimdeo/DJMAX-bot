"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banStickersHandler = void 0;
async function banStickersHandler(bot, message, banStickers) {
    const usingBannedSticker = message.stickers.filter((sticker) => banStickers.names.some((name) => sticker.name.match(name)));
    if (usingBannedSticker.size === 0) {
        return;
    }
    try {
        await message.member?.timeout(banStickers.duration, "금지된 스티커 사용");
    }
    catch (err) {
        console.error(err);
        // Do nothing!
    }
    const logChannel = bot.guilds.cache.get(message.guildId)?.channels.cache.get(banStickers.logChannelId);
    if (!logChannel || !logChannel.isTextBased()) {
        return;
    }
    await logChannel.send({
        content: `**${message.member?.nickname || message.author.username}**(${message.author.id}) timed out for using sticker ${message.stickers.map((sticker) => sticker.name).join(", ")}`,
    });
}
exports.banStickersHandler = banStickersHandler;
