"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log(`봇 로딩 중... 가동 시각: ${new Date().toLocaleString()}\n모듈 로딩 중...`);
const fs_1 = require("fs");
const discord_js_1 = require("discord.js");
const fuse_js_1 = __importDefault(require("fuse.js"));
const secretChat_1 = require("./modules/secretChat");
const types_1 = require("./types");
console.log("설정 불러오는 중...");
let config;
let configFilePath = ".";
function loadConfig(path = ".") {
    try {
        const configFile = JSON.parse((0, fs_1.readFileSync)(`${path}/config.json`, "utf-8"));
        if (!configFile.token ||
            !configFile.adminPrefix ||
            !configFile.admins ||
            !Array.isArray(configFile.admins)) {
            throw new Error("잘못된 설정 파일입니다.");
        }
        configFile.admins = configFile.admins.map((admin) => String(admin));
        return configFile;
    }
    catch (err) {
        if (err?.code === "ENOENT" && path === ".") {
            configFilePath = "..";
            return loadConfig("..");
        }
        else if (err?.code === "ENOENT") {
            throw new Error("설정 파일을 찾을 수 없습니다.");
        }
        throw err;
    }
}
try {
    config = loadConfig(configFilePath);
}
catch (err) {
    console.error("설정 파일을 불러오는 중 오류가 발생했습니다.");
    console.error(err);
    process.exit(1);
}
console.log("봇 생성 중...");
const bot = new types_1.Bot(configFilePath, config, {
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
const path = (0, fs_1.readdirSync)("./").includes("dist") ? "./dist" : ".";
const commands = (0, fs_1.readdirSync)(`${path}/commands`).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of commands) {
    const command = require(`./commands/${file}`);
    console.log(`명령어 불러오는 중.. (${command.data.name})`);
    bot.commands.set(command.data.name, command);
}
const adminCommands = (0, fs_1.readdirSync)(`${path}/adminCommands`).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of adminCommands) {
    const command = require(`./adminCommands/${file}`);
    console.log(`관리자 명령어 불러오는 중.. (${command.data.description})`);
    bot.adminCommands.set(command.data.name, command);
}
bot.once("ready", async () => {
    console.log("서열표 불러오는 중...");
    const songs = await fetch("https://v-archive.net/db/songs.json").then((res) => res.json());
    bot.songs = songs;
    bot.songsIndexed = new fuse_js_1.default(songs.map((song) => {
        const newSong = Object.assign({}, song);
        newSong.name = newSong.name.replace(/ /g, "").toLowerCase();
        newSong.composer = newSong.composer.replace(/ /g, "").toLowerCase();
        return newSong;
    }), {
        keys: [
            "name",
            {
                name: "composer",
                weight: 0.7,
            },
            {
                name: "dlc",
                weight: 0.8,
            },
        ],
        ignoreLocation: true,
    });
    const secretChat = bot.config.get("secretChat");
    if (secretChat) {
        console.log("비밀 채널에 작성된 메시지 삭제 중..");
        for (const channel of secretChat) {
            const guild = await bot.guilds.fetch(channel.guildId);
            const secretChannel = await guild.channels.fetch(channel.channelId);
            if (!secretChannel || !secretChannel.isTextBased()) {
                continue;
            }
            const messages = await secretChannel.messages.fetch();
            for (let i = 0; i < Math.ceil(messages.size / 100) + 1; i += 1) {
                await secretChannel.bulkDelete(100);
            }
        }
    }
    bot.user?.setStatus("online");
    console.log(`준비 완료! 토큰: \x1b[32m${config.token}\x1b[0m`);
});
bot.on("error", (err) => {
    console.error(err);
    exit();
});
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = bot.commands.get(interaction.commandName);
    if (!command)
        return;
    await command.execute(interaction, bot);
});
bot.on("messageCreate", async (message) => {
    const secretChat = bot.config.get("secretChat");
    if (secretChat) {
        const secretChatChannelIds = secretChat.map((secretChat) => secretChat.channelId);
        if (secretChatChannelIds.includes(message.channelId)) {
            const channel = secretChat.find((channel) => channel.channelId === message.channelId);
            (0, secretChat_1.secretChatHandler)(bot, message, channel);
        }
    }
    if (config.admins.includes(message.author.id) &&
        message.content.startsWith(config.adminPrefix)) {
        if (message.content === `${config.adminPrefix} quit`) {
            await message.react("✅");
            exit();
            return;
        }
        const command = bot.adminCommands.get(message.content.split(" ")[1]);
        if (command) {
            await command.execute(message, bot);
        }
    }
});
console.log("로그인 중...");
bot.login(config.token);
async function exit() {
    console.log("종료 중...");
    const secretChat = bot.config.get("secretChat");
    if (process.env.NODE_ENV !== "development" && secretChat) {
        for (const channel of secretChat) {
            const guild = bot.guilds.cache.get(channel.guildId);
            if (!guild) {
                continue;
            }
            const chatChannel = guild.channels.cache.get(channel.channelId);
            if (!chatChannel || !chatChannel.isTextBased()) {
                continue;
            }
            await chatChannel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle(":warning: 봇이 가동 중이지 않습니다.")
                        .setDescription("지금 치는 채팅은 삭제되지 않고, 다음 봇 가동 시에 일괄 삭제됩니다. 주의하세요!"),
                ],
            });
        }
    }
    bot.user?.setStatus("invisible");
    bot.destroy();
    process.exit(0);
}
process.on("SIGINT", exit);
process.on("SIGTERM", exit);
