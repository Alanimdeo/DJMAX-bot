import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Bot, Command, DLCCode, DLCColor, Song, SongSimplified } from "../types";
import { simplify } from "../modules/simplify";
import { starIcon } from "../modules/starIcons";

enum DLCNames {
  "R" = "RESPECT",
  "VE" = "V EXTENSION",
  "VE2" = "V EXTENSION 2",
  "VE3" = "V EXTENSION 3",
  "VE4" = "V EXTENSION 4",
  "VE5" = "V EXTENSION 5",
  "P1" = "Portable 1",
  "P2" = "Portable 2",
  "P3" = "Portable 3",
  "ES" = "Emotional Sense",
  "TR" = "Trilogy",
  "BS" = "Black Square",
  "CE" = "Clazziquai Edition",
  "T1" = "TECHNIKA",
  "T2" = "TECHNIKA 2",
  "T3" = "TECHNIKA 3",
  "TQ" = "TECHNIKA TUNE & Q",
  "GG" = "GUILTY GEAR",
  "GF" = "GIRLS' FRONTLINE",
  "GC" = "GROOVE COASTER",
  "DM" = "Deemo",
  "CY" = "Cytus",
  "CHU" = "CHUNITHM",
  "ESTI" = "ESTIMATE",
  "NXN" = "NEXON",
  "MD" = "Muse Dash",
  "EZ2" = "EZ2ON REBOOT : R",
  "MAP" = "MAPLESTORY",
  "CP" = "CLEAR PASS",
}

module.exports = new Command(
  new SlashCommandBuilder()
    .setName("검색")
    .setDescription("곡 정보를 검색합니다.")
    .addStringOption((option) => option.setName("검색어").setDescription("검색할 곡을 입력하세요.").setRequired(true)),
  async (message: ChatInputCommandInteraction, bot: Bot) => {
    await message.deferReply();
    const query = message.options.getString("검색어", true);

    const bestMatch = findSimilarSong(query, bot.songsSimplified);
    if (!bestMatch) {
      await message.editReply("검색 결과가 없습니다.");
      return;
    }

    const song = bot.songs.find((song) => song.title === bestMatch.title)!;
    const DLCName = DLCNames[song.dlcCode];

    await message.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(DLCColor[song.dlcCode])
          .setAuthor({
            name: DLCName,
          })
          .setTitle(song.name)
          .setURL(`https://v-archive.net/db/title/${song.title}`)
          .setDescription(song.composer)
          .setThumbnail(`https://v-archive.net/static/images/jackets/${song.title}.jpg`)
          .addFields(
            {
              name: "4B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["4B"]["NM"]
                  ? starIcon(bot, song.patterns["4B"]["NM"].level) + song.patterns["4B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["4B"]["HD"]
                  ? starIcon(bot, song.patterns["4B"]["HD"].level) +
                    song.patterns["4B"]["HD"].level +
                    ("floor" in song.patterns["4B"]["HD"] ? " (" + song.patterns["4B"]["HD"].floor + ")" : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["4B"]["MX"]
                  ? starIcon(bot, song.patterns["4B"]["MX"].level) +
                    song.patterns["4B"]["MX"].level +
                    ("floor" in song.patterns["4B"]["MX"] ? " (" + song.patterns["4B"]["MX"].floor + ")" : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["4B"]["SC"]
                  ? starIcon(bot, song.patterns["4B"]["SC"].level, true) +
                    song.patterns["4B"]["SC"].level +
                    ("floor" in song.patterns["4B"]["SC"] ? " (" + song.patterns["4B"]["SC"].floor + ")" : "")
                  : "-"
              }`,
            },
            {
              name: "5B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["5B"]["NM"]
                  ? starIcon(bot, song.patterns["5B"]["NM"].level) + song.patterns["5B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["5B"]["HD"]
                  ? starIcon(bot, song.patterns["5B"]["HD"].level) +
                    song.patterns["5B"]["HD"].level +
                    ("floor" in song.patterns["5B"]["HD"] ? " (" + song.patterns["5B"]["HD"].floor + ")" : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["5B"]["MX"]
                  ? starIcon(bot, song.patterns["5B"]["MX"].level) +
                    song.patterns["5B"]["MX"].level +
                    ("floor" in song.patterns["5B"]["MX"] ? " (" + song.patterns["5B"]["MX"].floor + ")" : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["5B"]["SC"]
                  ? starIcon(bot, song.patterns["5B"]["SC"].level, true) +
                    song.patterns["5B"]["SC"].level +
                    ("floor" in song.patterns["5B"]["SC"] ? " (" + song.patterns["5B"]["SC"].floor + ")" : "")
                  : "-"
              }`,
            },
            {
              name: " ",
              value: " ",
            },
            {
              name: "6B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["6B"]["NM"]
                  ? starIcon(bot, song.patterns["6B"]["NM"].level) + song.patterns["6B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["6B"]["HD"]
                  ? starIcon(bot, song.patterns["6B"]["HD"].level) +
                    song.patterns["6B"]["HD"].level +
                    ("floor" in song.patterns["6B"]["HD"] ? " (" + song.patterns["6B"]["HD"].floor + ")" : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["6B"]["MX"]
                  ? starIcon(bot, song.patterns["6B"]["MX"].level) +
                    song.patterns["6B"]["MX"].level +
                    ("floor" in song.patterns["6B"]["MX"] ? " (" + song.patterns["6B"]["MX"].floor + ")" : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["6B"]["SC"]
                  ? starIcon(bot, song.patterns["6B"]["SC"].level, true) +
                    song.patterns["6B"]["SC"].level +
                    ("floor" in song.patterns["6B"]["SC"] ? " (" + song.patterns["6B"]["SC"].floor + ")" : "")
                  : "-"
              }`,
            },
            {
              name: "8B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["8B"]["NM"]
                  ? starIcon(bot, song.patterns["8B"]["NM"].level) + song.patterns["8B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["8B"]["HD"]
                  ? starIcon(bot, song.patterns["8B"]["HD"].level) +
                    song.patterns["8B"]["HD"].level +
                    ("floor" in song.patterns["8B"]["HD"] ? " (" + song.patterns["8B"]["HD"].floor + ")" : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["8B"]["MX"]
                  ? starIcon(bot, song.patterns["8B"]["MX"].level) +
                    song.patterns["8B"]["MX"].level +
                    ("floor" in song.patterns["8B"]["MX"] ? " (" + song.patterns["8B"]["MX"].floor + ")" : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["8B"]["SC"]
                  ? starIcon(bot, song.patterns["8B"]["SC"].level, true) +
                    song.patterns["8B"]["SC"].level +
                    ("floor" in song.patterns["8B"]["SC"] ? " (" + song.patterns["8B"]["SC"].floor + ")" : "")
                  : "-"
              }`,
            },
            {
              name: " ",
              value: " ",
            }
          ),
        // .setFooter({
        //   text: song.dlc,
        // }),
      ],
    });
  }
);

function findSimilarSong(input: string, songList: (Song | SongSimplified)[]) {
  input = simplify(input);

  let bestMatch: Song | SongSimplified | null = null;
  let bestMatchScore = Infinity;

  // Iterate through each song in the list
  for (const song of songList) {
    // Calculate the Levenshtein distance between the input and the song's fields
    const nameDistance = levenshteinDistance(input, song.name);
    const composerDistance = levenshteinDistance(input, song.composer);
    const dlcDistance = levenshteinDistance(input, DLCNames[song.dlcCode.toUpperCase() as DLCCode]);
    const dlcCodeDistance = levenshteinDistance(input, song.dlcCode);

    const nameWeight = 5;
    const composerWeight = 0.2;
    const dlcWeight = 0.8;
    const dlcCodeWeight = 2;

    // Calculate the average distance
    const distance =
      nameDistance * nameWeight +
      composerDistance * composerWeight +
      dlcDistance * dlcWeight +
      dlcCodeDistance * dlcCodeWeight;

    // Update the best match if a closer match is found
    if (distance < bestMatchScore) {
      bestMatch = song;
      bestMatchScore = distance;
    }
  }

  return bestMatch;
}

function levenshteinDistance(a: string, b: string) {
  const distanceMatrix = [];

  // Initialize the distance matrix
  for (let i = 0; i <= a.length; i++) {
    distanceMatrix[i] = [i];
  }

  for (let j = 0; j <= b.length; j++) {
    distanceMatrix[0][j] = j;
  }

  // Calculate the distance matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[i][j] = Math.min(
        distanceMatrix[i - 1][j] + 1, // deletion
        distanceMatrix[i][j - 1] + 1, // insertion
        distanceMatrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  // Return the Levenshtein distance between the two strings
  return distanceMatrix[a.length][b.length];
}
