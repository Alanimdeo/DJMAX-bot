import { Bot } from "../types";

export function starIcon(bot: Bot, level: number, SC: boolean = false) {
  const starIcons = bot.config.get("starIcons");
  let color: "5" | "10" | "15";

  if (level > 10) {
    color = "15";
  } else if (level > 5) {
    color = "10";
  } else {
    color = "5";
  }

  return SC ? starIcons[`SC${color}`] : starIcons[color];
}
