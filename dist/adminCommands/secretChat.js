"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
module.exports = new types_1.Command(new discord_js_1.SlashCommandBuilder().setName("secretchat").setDescription("비밀 채팅방"), async (message, bot) => {
    function checkExistingSecretChat(channelId) {
        return bot.config.get("secretChat").some((secretChat) => secretChat.channelId === channelId);
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
    function createSecretChat(channelId, duration) {
        const secretChat = bot.config.get("secretChat");
        secretChat.push({ guildId: message.guildId, channelId, duration });
        bot.config.set("secretChat", secretChat);
    }
    function deleteSecretChat(channelId) {
        const secretChat = bot.config.get("secretChat");
        bot.config.set("secretChat", secretChat.filter((secretChat) => secretChat.channelId !== channelId));
    }
});
