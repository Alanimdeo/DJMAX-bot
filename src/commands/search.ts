import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Bot, Command, DLCNames, DLCColor, Song } from "../types";
import { starIcon } from "../modules/starIcons";

module.exports = new Command(
  new SlashCommandBuilder()
    .setName("검색")
    .setDescription("곡 정보를 검색합니다.")
    .addStringOption((option) =>
      option
        .setName("검색어")
        .setDescription("검색할 곡을 입력하세요.")
        .setRequired(true)
    ),
  async (message: ChatInputCommandInteraction, bot: Bot) => {
    await message.deferReply();
    const query = message.options.getString("검색어", true);

    const searchResult = bot.songsIndexed.search(
      query.replace(/ /g, "").toLowerCase()
    );
    if (searchResult.length === 0) {
      await message.editReply("검색 결과가 없습니다.");
      return;
    }

    const bestMatch = searchResult[0].item;

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
          .setThumbnail(
            `https://v-archive.net/static/images/jackets/${song.title}.jpg`
          )
          .addFields(
            {
              name: "4B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["4B"]["NM"]
                  ? starIcon(bot, song.patterns["4B"]["NM"].level) +
                    song.patterns["4B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["4B"]["HD"]
                  ? starIcon(bot, song.patterns["4B"]["HD"].level) +
                    song.patterns["4B"]["HD"].level +
                    ("floor" in song.patterns["4B"]["HD"]
                      ? " (" + song.patterns["4B"]["HD"].floor + ")"
                      : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["4B"]["MX"]
                  ? starIcon(bot, song.patterns["4B"]["MX"].level) +
                    song.patterns["4B"]["MX"].level +
                    ("floor" in song.patterns["4B"]["MX"]
                      ? " (" + song.patterns["4B"]["MX"].floor + ")"
                      : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["4B"]["SC"]
                  ? starIcon(bot, song.patterns["4B"]["SC"].level, true) +
                    song.patterns["4B"]["SC"].level +
                    ("floor" in song.patterns["4B"]["SC"]
                      ? " (" + song.patterns["4B"]["SC"].floor + ")"
                      : "")
                  : "-"
              }`,
            },
            {
              name: "5B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["5B"]["NM"]
                  ? starIcon(bot, song.patterns["5B"]["NM"].level) +
                    song.patterns["5B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["5B"]["HD"]
                  ? starIcon(bot, song.patterns["5B"]["HD"].level) +
                    song.patterns["5B"]["HD"].level +
                    ("floor" in song.patterns["5B"]["HD"]
                      ? " (" + song.patterns["5B"]["HD"].floor + ")"
                      : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["5B"]["MX"]
                  ? starIcon(bot, song.patterns["5B"]["MX"].level) +
                    song.patterns["5B"]["MX"].level +
                    ("floor" in song.patterns["5B"]["MX"]
                      ? " (" + song.patterns["5B"]["MX"].floor + ")"
                      : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["5B"]["SC"]
                  ? starIcon(bot, song.patterns["5B"]["SC"].level, true) +
                    song.patterns["5B"]["SC"].level +
                    ("floor" in song.patterns["5B"]["SC"]
                      ? " (" + song.patterns["5B"]["SC"].floor + ")"
                      : "")
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
                  ? starIcon(bot, song.patterns["6B"]["NM"].level) +
                    song.patterns["6B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["6B"]["HD"]
                  ? starIcon(bot, song.patterns["6B"]["HD"].level) +
                    song.patterns["6B"]["HD"].level +
                    ("floor" in song.patterns["6B"]["HD"]
                      ? " (" + song.patterns["6B"]["HD"].floor + ")"
                      : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["6B"]["MX"]
                  ? starIcon(bot, song.patterns["6B"]["MX"].level) +
                    song.patterns["6B"]["MX"].level +
                    ("floor" in song.patterns["6B"]["MX"]
                      ? " (" + song.patterns["6B"]["MX"].floor + ")"
                      : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["6B"]["SC"]
                  ? starIcon(bot, song.patterns["6B"]["SC"].level, true) +
                    song.patterns["6B"]["SC"].level +
                    ("floor" in song.patterns["6B"]["SC"]
                      ? " (" + song.patterns["6B"]["SC"].floor + ")"
                      : "")
                  : "-"
              }`,
            },
            {
              name: "8B TUNES",
              value: `\` NORMAL\`: ${
                song.patterns["8B"]["NM"]
                  ? starIcon(bot, song.patterns["8B"]["NM"].level) +
                    song.patterns["8B"]["NM"].level
                  : "-"
              }
\`   HARD\`: ${
                song.patterns["8B"]["HD"]
                  ? starIcon(bot, song.patterns["8B"]["HD"].level) +
                    song.patterns["8B"]["HD"].level +
                    ("floor" in song.patterns["8B"]["HD"]
                      ? " (" + song.patterns["8B"]["HD"].floor + ")"
                      : "")
                  : "-"
              }
\`MAXIMUM\`: ${
                song.patterns["8B"]["MX"]
                  ? starIcon(bot, song.patterns["8B"]["MX"].level) +
                    song.patterns["8B"]["MX"].level +
                    ("floor" in song.patterns["8B"]["MX"]
                      ? " (" + song.patterns["8B"]["MX"].floor + ")"
                      : "")
                  : "-"
              }
\`     SC\`: ${
                song.patterns["8B"]["SC"]
                  ? starIcon(bot, song.patterns["8B"]["SC"].level, true) +
                    song.patterns["8B"]["SC"].level +
                    ("floor" in song.patterns["8B"]["SC"]
                      ? " (" + song.patterns["8B"]["SC"].floor + ")"
                      : "")
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
