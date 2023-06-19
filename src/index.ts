console.log(`봇 로딩 중... 가동 시각: ${new Date().toLocaleString()}\n모듈 로딩 중...`);
import { readdirSync, readFileSync } from "fs";
import { EmbedBuilder, GatewayIntentBits, Message } from "discord.js";
import { secretChatHandler } from "./modules/secretChat";
import { Bot, Command, Config } from "./types";

console.log("설정 불러오는 중...");
let config: Config;
let configFilePath = ".";
function loadConfig(path: string = "."): Config {
  try {
    const configFile = JSON.parse(readFileSync(`${path}/config.json`, "utf-8"));
    if (!configFile.token || !configFile.adminPrefix || !configFile.admins || !Array.isArray(configFile.admins)) {
      throw new Error("잘못된 설정 파일입니다.");
    }
    configFile.admins = configFile.admins.map((admin: string | number) => String(admin));
    return configFile as Config;
  } catch (err: any) {
    if (err?.code === "ENOENT" && path === ".") {
      configFilePath = "..";
      return loadConfig("..");
    } else if (err?.code === "ENOENT") {
      throw new Error("설정 파일을 찾을 수 없습니다.");
    }
    throw err;
  }
}

try {
  config = loadConfig(configFilePath);
} catch (err) {
  console.error("설정 파일을 불러오는 중 오류가 발생했습니다.");
  console.error(err);
  process.exit(1);
}

console.log("봇 생성 중...");
const bot: Bot = new Bot(configFilePath, config, {
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const path = readdirSync("./").includes("dist") ? "./dist" : ".";
const commands = readdirSync(`${path}/commands`).filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of commands) {
  const command: Command = require(`./commands/${file}`);
  console.log(`명령어 불러오는 중.. (${command.data.name})`);
  bot.commands.set(command.data.name, command);
}

const adminCommands = readdirSync(`${path}/adminCommands`).filter(
  (file: string) => file.endsWith(".js") || file.endsWith(".ts")
);
for (const file of adminCommands) {
  const command: Command = require(`./adminCommands/${file}`);
  console.log(`관리자 명령어 불러오는 중.. (${command.data.description})`);
  bot.adminCommands.set(command.data.name, command);
}

bot.once("ready", async () => {
  console.log("비밀 채널에 작성된 메시지 삭제 중..");
  const secretChat = bot.config.get("secretChat");
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

  bot.user?.setStatus("online");
  console.log(`준비 완료! 토큰: \x1b[32m${config.token}\x1b[0m`);
});

bot.on("error", (err) => {
  console.error(err);
  exit();
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = bot.commands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction, bot);
});

bot.on("messageCreate", async (message: Message) => {
  const secretChat = bot.config.get("secretChat");
  const secretChatChannelIds = secretChat.map((secretChat) => secretChat.channelId);

  if (config.admins.includes(message.author.id)) {
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

  if (secretChatChannelIds.includes(message.channelId)) {
    const channel = secretChat.find((channel) => channel.channelId === message.channelId)!;
    secretChatHandler(bot, message, channel);
  }
});

console.log("로그인 중...");
bot.login(config.token);

async function exit() {
  console.log("종료 중...");
  const secretChat = bot.config.get("secretChat");
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
        new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle(":warning: 봇이 가동 중이지 않습니다.")
          .setDescription("지금 치는 채팅은 삭제되지 않고, 다음 봇 가동 시에 일괄 삭제됩니다. 주의하세요!"),
      ],
    });
  }
  bot.user?.setStatus("invisible");
  bot.destroy();
  process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
