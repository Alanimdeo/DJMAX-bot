"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starIcon = void 0;
function starIcon(bot, level, SC = false) {
    const starIcons = bot.config.get("starIcons");
    let color;
    if (level > 10) {
        color = "15";
    }
    else if (level > 5) {
        color = "10";
    }
    else {
        color = "5";
    }
    return SC ? starIcons[`SC${color}`] : starIcons[color];
}
exports.starIcon = starIcon;
