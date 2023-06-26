import {
  Client,
  ClientOptions,
  Collection,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { writeFileSync } from "fs";
import path from "path";

export type Config = {
  token: string;
  adminPrefix: string;
  admins: string[];
  secretChat: SecretChat[];
  banStickers: BanStickers;
};

export type SecretChat = {
  guildId: string;
  channelId: string;
  duration: number;
  logChannelId?: string;
};

export type BanStickers = {
  names: RegExp[];
  duration: number;
  logChannelId: string;
};

export class Bot extends Client {
  private _config: Config;
  private _configFilePath: string;
  config: {
    getAll: () => Config;
    get: <T extends keyof Config>(key: T) => Config[T];
    set: <T extends keyof Config>(key: T, value: Config[T]) => void;
  };
  commands: Collection<string, Command<ChatInputCommandInteraction>>;
  adminCommands: Collection<string, Command<Message>>;

  constructor(configFilePath: string, config: Config, clientOptions: ClientOptions) {
    super(clientOptions);
    this._config = config;
    this._configFilePath = configFilePath;
    this.config = {
      getAll: () => {
        return this._config;
      },
      get: <T extends keyof Config>(key: T) => {
        return this._config[key];
      },
      set: <T extends keyof Config>(key: T, value: Config[T]) => {
        const config: any = Object.assign({}, this._config);
        if (key === "banStickers") {
          this._config[key] = value;
          config[key] = Object.assign({}, value);
          config.banStickers.names = (value as BanStickers).names.map((name: RegExp) => name.source);
        } else {
          this._config[key] = value;
          config[key] = value;
        }
        writeFileSync(path.join(this._configFilePath, "config.json"), JSON.stringify(config, null, 2));
      },
    };
    this.commands = new Collection<string, Command>();
    this.adminCommands = new Collection<string, Command>();
  }
}

export type CommandExecutable<T = ChatInputCommandInteraction | Message | string[]> = (
  input: T,
  bot: Bot
) => Promise<any>;

export class Command<T = ChatInputCommandInteraction | Message | string[]> {
  data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
  execute: CommandExecutable<T>;

  constructor(data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">, execute: CommandExecutable<T>) {
    this.data = data;
    this.execute = execute;
  }
}
