"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLCColor = exports.Command = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class Bot extends discord_js_1.Client {
    _config;
    _configFilePath;
    config;
    commands;
    adminCommands;
    songs;
    songsSimplified;
    constructor(configFilePath, config, clientOptions) {
        super(clientOptions);
        this._config = config;
        this._configFilePath = configFilePath;
        this.config = {
            getAll: () => {
                return this._config;
            },
            get: (key) => {
                return this._config[key];
            },
            set: (key, value) => {
                const config = Object.assign({}, this._config);
                this._config[key] = value;
                config[key] = value;
                (0, fs_1.writeFileSync)(path_1.default.join(this._configFilePath, "config.json"), JSON.stringify(config, null, 2));
            },
        };
        this.commands = new discord_js_1.Collection();
        this.adminCommands = new discord_js_1.Collection();
        this.songs = [];
        this.songsSimplified = [];
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
var DLCColor;
(function (DLCColor) {
    DLCColor["R"] = "#f0b405";
    DLCColor["VE"] = "#ff6f1b";
    DLCColor["VE2"] = "#cb1d40";
    DLCColor["VE3"] = "#7425dd";
    DLCColor["VE4"] = "#c11100";
    DLCColor["VE5"] = "#fba902";
    DLCColor["P1"] = "#00b4d4";
    DLCColor["P2"] = "#ff6e90";
    DLCColor["P3"] = "#bc5906";
    DLCColor["ES"] = "#1eb611";
    DLCColor["TR"] = "#7289ff";
    DLCColor["BS"] = "#dc1b49";
    DLCColor["CE"] = "#ffEdc1";
    DLCColor["T1"] = "#fc59ce";
    DLCColor["T2"] = "#fb4a6c";
    DLCColor["T3"] = "#5589fc";
    DLCColor["TQ"] = "#0ad900";
    DLCColor["GG"] = "#b84f2a";
    DLCColor["GF"] = "#fdb300";
    DLCColor["GC"] = "#84ecfc";
    DLCColor["DM"] = "#ade6cf";
    DLCColor["CY"] = "#d33745";
    DLCColor["CHU"] = "#f9d94a";
    DLCColor["ESTI"] = "#e5d3a1";
    DLCColor["NXN"] = "#c7d644";
    DLCColor["MD"] = "#da3379";
    DLCColor["EZ2"] = "#1ccfe3";
    DLCColor["MAP"] = "#d84a1e";
    DLCColor["CP"] = "#ffbc00";
})(DLCColor || (exports.DLCColor = DLCColor = {}));
