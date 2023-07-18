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
  logChannelId?: string;
};

export type SecretChat = {
  guildId: string;
  channelId: string;
  duration: number;
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
  songs: Song[];
  songsSimplified: SongSimplified[];

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
        this._config[key] = value;
        config[key] = value;
        writeFileSync(path.join(this._configFilePath, "config.json"), JSON.stringify(config, null, 2));
      },
    };
    this.commands = new Collection<string, Command>();
    this.adminCommands = new Collection<string, Command>();
    this.songs = [];
    this.songsSimplified = [];
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

export type Song = {
  title: number;
  name: string;
  composer: string;
  dlcCode: DLCCode;
  dlc: DLC;
  patterns: Patterns;
};

export type SongSimplified = {
  title: number;
  name: string;
  composer: string;
  dlcCode: string;
  dlc: string;
  patterns: Patterns;
};

export type DLCCode =
  | "R"
  | "VE"
  | "VE2"
  | "VE3"
  | "VE4"
  | "P1"
  | "P2"
  | "P3"
  | "ES"
  | "TR"
  | "BS"
  | "CE"
  | "T1"
  | "T2"
  | "T3"
  | "TQ"
  | "GG"
  | "GF"
  | "GC"
  | "DM"
  | "CY"
  | "CHU"
  | "ESTI"
  | "NXN"
  | "MD"
  | "EZ2";

export type DLC =
  | "RESPECT"
  | "V EXTENSION"
  | "V EXTENSION 2"
  | "V EXTENSION 3"
  | "V EXTENSION 4"
  | "PORTABLE 1"
  | "PORTABLE 2"
  | "PORTABLE 3"
  | "EMOTIONAL S."
  | "TRILOGY"
  | "BLACK SQUARE"
  | "CLAZZIQUAI"
  | "TECHNIKA 1"
  | "TECHNIKA 2"
  | "TECHNIKA 3"
  | "TECHNIKA T&Q"
  | "COLLABORATION";

export enum DLCColor {
  "R" = "#f0b405",
  "VE" = "#ff6f1b",
  "VE2" = "#cb1d40",
  "VE3" = "#7425dd",
  "VE4" = "#c11100",
  "P1" = "#00b4d4",
  "P2" = "#ff6e90",
  "P3" = "#bc5906",
  "ES" = "#1eb611",
  "TR" = "#7289ff",
  "BS" = "#dc1b49",
  "CE" = "#ffEdc1",
  "T1" = "#fc59ce",
  "T2" = "#fb4a6c",
  "T3" = "#5589fc",
  "TQ" = "#0ad900",
  "GG" = "#b84f2a",
  "GF" = "#fdb300",
  "GC" = "#84ecfc",
  "DM" = "#ade6cf",
  "CY" = "#d33745",
  "CHU" = "#f9d94a",
  "ESTI" = "#e5d3a1",
  "NXN" = "#c7d644",
  "MD" = "#da3379",
  "EZ2" = "#1ccfe3",
}

export type Patterns = {
  "4B": Button;
  "5B": Button;
  "6B": Button;
  "8B": Button;
};

export type Button = {
  NM?: Pattern;
  HD?: Pattern | SCPattern;
  MX?: Pattern | SCPattern;
  SC?: Pattern | SCPattern;
};

export type Pattern = {
  level: number;
};

export type SCPattern = Pattern & {
  floor: number;
};
