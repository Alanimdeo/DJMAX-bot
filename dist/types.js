"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLCColor = exports.DLCNames = exports.Command = exports.Bot = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
const fuse_js_1 = __importDefault(require("fuse.js"));
class Bot extends discord_js_1.Client {
    _config;
    _configFilePath;
    config;
    commands;
    adminCommands;
    songs;
    songsIndexed;
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
        this.songsIndexed = new fuse_js_1.default([]);
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
var DLCNames;
(function (DLCNames) {
    DLCNames["R"] = "RESPECT";
    DLCNames["VE"] = "V EXTENSION";
    DLCNames["VE2"] = "V EXTENSION 2";
    DLCNames["VE3"] = "V EXTENSION 3";
    DLCNames["VE4"] = "V EXTENSION 4";
    DLCNames["VE5"] = "V EXTENSION 5";
    DLCNames["VL"] = "V LIBERTY";
    DLCNames["VL2"] = "V LIBERTY II";
    DLCNames["P1"] = "Portable 1";
    DLCNames["P2"] = "Portable 2";
    DLCNames["P3"] = "Portable 3";
    DLCNames["ES"] = "Emotional Sense";
    DLCNames["TR"] = "Trilogy";
    DLCNames["BS"] = "Black Square";
    DLCNames["CE"] = "Clazziquai Edition";
    DLCNames["T1"] = "TECHNIKA";
    DLCNames["T2"] = "TECHNIKA 2";
    DLCNames["T3"] = "TECHNIKA 3";
    DLCNames["TQ"] = "TECHNIKA TUNE & Q";
    DLCNames["PLI1"] = "PLI : 2025";
    DLCNames["GG"] = "GUILTY GEAR";
    DLCNames["GF"] = "GIRLS' FRONTLINE";
    DLCNames["GC"] = "GROOVE COASTER";
    DLCNames["DM"] = "Deemo";
    DLCNames["CY"] = "Cytus";
    DLCNames["CHU"] = "CHUNITHM";
    DLCNames["ESTI"] = "ESTIMATE";
    DLCNames["NXN"] = "NEXON";
    DLCNames["MD"] = "Muse Dash";
    DLCNames["EZ2"] = "EZ2ON REBOOT : R";
    DLCNames["MAP"] = "MAPLESTORY";
    DLCNames["FAL"] = "NIHON FALCOM";
    DLCNames["TEK"] = "TEKKEN";
    DLCNames["CP"] = "CLEAR PASS";
})(DLCNames || (exports.DLCNames = DLCNames = {}));
var DLCColor;
(function (DLCColor) {
    DLCColor["R"] = "#f0b405";
    DLCColor["VE"] = "#ff6f1b";
    DLCColor["VE2"] = "#cb1d40";
    DLCColor["VE3"] = "#7425dd";
    DLCColor["VE4"] = "#c11100";
    DLCColor["VE5"] = "#fba902";
    DLCColor["VL"] = "#ee74bf";
    DLCColor["VL2"] = "#78cc25";
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
    DLCColor["PLI1"] = "#ffffee";
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
    DLCColor["FAL"] = "#8ec765";
    DLCColor["TEK"] = "#ffffff";
    DLCColor["CP"] = "#ffbc00";
})(DLCColor || (exports.DLCColor = DLCColor = {}));
