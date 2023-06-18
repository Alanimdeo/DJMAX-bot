"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class Bot extends discord_js_1.Client {
    _config;
    _configFilePath;
    config;
    commands;
    adminCommands;
    constructor(configFilePath, config, clientOptions) {
        super(clientOptions);
        this._config = config;
        this._configFilePath = configFilePath;
        this.config = {
            get: (key) => {
                return this._config[key];
            },
            set: (key, value) => {
                this._config[key] = value;
                (0, fs_1.writeFileSync)(path_1.default.join(this._configFilePath, "config.json"), JSON.stringify(this._config, null, 2));
            },
        };
        this.commands = new discord_js_1.Collection();
        this.adminCommands = new discord_js_1.Collection();
    }
}
exports.Bot = Bot;
class Command {
    data;
    execute;
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
exports.Command = Command;
