export const starIcons = {
  "5": ":star_5:",
  "10": ":star_10:",
  "15": ":star_15:",
  SC5: ":star_sc5:",
  SC10: ":star_sc10:",
  SC15: ":star_sc15:",
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
