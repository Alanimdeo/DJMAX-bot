"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starIcon = exports.starIcons = void 0;
exports.starIcons = {
    "5": ":star_5:",
    "10": ":star_10:",
    "15": ":star_15:",
    SC5: ":star_sc5:",
    SC10: ":star_sc10:",
    SC15: ":star_sc15:",
};
function starIcon(level, SC = false) {
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
    return SC ? exports.starIcons[`SC${color}`] : exports.starIcons[color];
}
exports.starIcon = starIcon;
