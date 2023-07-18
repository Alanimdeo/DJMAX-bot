export const starIcons = {
  "5": "<:star_5:1130681683985834145>",
  "10": "<:star_10:1130681686041038910>",
  "15": "<:star_15:1130681688897359954>",
  SC5: "<:star_sc5:1130681692584153130>",
  SC10: "<:star_sc10:1130681694719049738>",
  SC15: "<:star_sc15:1130681698292604939>",
};

export function starIcon(level: number, SC: boolean = false) {
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
