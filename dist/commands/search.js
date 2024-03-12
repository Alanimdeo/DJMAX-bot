"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
const simplify_1 = require("../modules/simplify");
const starIcons_1 = require("../modules/starIcons");
var DLCNames;
(function (DLCNames) {
    DLCNames["R"] = "RESPECT";
    DLCNames["VE"] = "V EXTENSION";
    DLCNames["VE2"] = "V EXTENSION 2";
    DLCNames["VE3"] = "V EXTENSION 3";
    DLCNames["VE4"] = "V EXTENSION 4";
    DLCNames["VE5"] = "V EXTENSION 5";
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
    DLCNames["CP"] = "CLEAR PASS";
})(DLCNames || (DLCNames = {}));
module.exports = new types_1.Command(new discord_js_1.SlashCommandBuilder()
    .setName("검색")
    .setDescription("곡 정보를 검색합니다.")
    .addStringOption((option) => option.setName("검색어").setDescription("검색할 곡을 입력하세요.").setRequired(true)), async (message, bot) => {
    await message.deferReply();
    const query = message.options.getString("검색어", true);
    const bestMatch = findSimilarSong(query, bot.songsSimplified);
    if (!bestMatch) {
        await message.editReply("검색 결과가 없습니다.");
        return;
    }
    const song = bot.songs.find((song) => song.title === bestMatch.title);
    const DLCName = DLCNames[song.dlcCode];
    await message.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(types_1.DLCColor[song.dlcCode])
                .setAuthor({
                name: DLCName,
            })
                .setTitle(song.name)
                .setURL(`https://v-archive.net/db/title/${song.title}`)
                .setDescription(song.composer)
                .setThumbnail(`https://v-archive.net/static/images/jackets/${song.title}.jpg`)
                .addFields({
                name: "4B TUNES",
                value: `\` NORMAL\`: ${song.patterns["4B"]["NM"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["4B"]["NM"].level) + song.patterns["4B"]["NM"].level
                    : "-"}
\`   HARD\`: ${song.patterns["4B"]["HD"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["4B"]["HD"].level) +
                        song.patterns["4B"]["HD"].level +
                        ("floor" in song.patterns["4B"]["HD"] ? " (" + song.patterns["4B"]["HD"].floor + ")" : "")
                    : "-"}
\`MAXIMUM\`: ${song.patterns["4B"]["MX"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["4B"]["MX"].level) +
                        song.patterns["4B"]["MX"].level +
                        ("floor" in song.patterns["4B"]["MX"] ? " (" + song.patterns["4B"]["MX"].floor + ")" : "")
                    : "-"}
\`     SC\`: ${song.patterns["4B"]["SC"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["4B"]["SC"].level, true) +
                        song.patterns["4B"]["SC"].level +
                        ("floor" in song.patterns["4B"]["SC"] ? " (" + song.patterns["4B"]["SC"].floor + ")" : "")
                    : "-"}`,
            }, {
                name: "5B TUNES",
                value: `\` NORMAL\`: ${song.patterns["5B"]["NM"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["5B"]["NM"].level) + song.patterns["5B"]["NM"].level
                    : "-"}
\`   HARD\`: ${song.patterns["5B"]["HD"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["5B"]["HD"].level) +
                        song.patterns["5B"]["HD"].level +
                        ("floor" in song.patterns["5B"]["HD"] ? " (" + song.patterns["5B"]["HD"].floor + ")" : "")
                    : "-"}
\`MAXIMUM\`: ${song.patterns["5B"]["MX"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["5B"]["MX"].level) +
                        song.patterns["5B"]["MX"].level +
                        ("floor" in song.patterns["5B"]["MX"] ? " (" + song.patterns["5B"]["MX"].floor + ")" : "")
                    : "-"}
\`     SC\`: ${song.patterns["5B"]["SC"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["5B"]["SC"].level, true) +
                        song.patterns["5B"]["SC"].level +
                        ("floor" in song.patterns["5B"]["SC"] ? " (" + song.patterns["5B"]["SC"].floor + ")" : "")
                    : "-"}`,
            }, {
                name: " ",
                value: " ",
            }, {
                name: "6B TUNES",
                value: `\` NORMAL\`: ${song.patterns["6B"]["NM"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["6B"]["NM"].level) + song.patterns["6B"]["NM"].level
                    : "-"}
\`   HARD\`: ${song.patterns["6B"]["HD"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["6B"]["HD"].level) +
                        song.patterns["6B"]["HD"].level +
                        ("floor" in song.patterns["6B"]["HD"] ? " (" + song.patterns["6B"]["HD"].floor + ")" : "")
                    : "-"}
\`MAXIMUM\`: ${song.patterns["6B"]["MX"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["6B"]["MX"].level) +
                        song.patterns["6B"]["MX"].level +
                        ("floor" in song.patterns["6B"]["MX"] ? " (" + song.patterns["6B"]["MX"].floor + ")" : "")
                    : "-"}
\`     SC\`: ${song.patterns["6B"]["SC"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["6B"]["SC"].level, true) +
                        song.patterns["6B"]["SC"].level +
                        ("floor" in song.patterns["6B"]["SC"] ? " (" + song.patterns["6B"]["SC"].floor + ")" : "")
                    : "-"}`,
            }, {
                name: "8B TUNES",
                value: `\` NORMAL\`: ${song.patterns["8B"]["NM"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["8B"]["NM"].level) + song.patterns["8B"]["NM"].level
                    : "-"}
\`   HARD\`: ${song.patterns["8B"]["HD"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["8B"]["HD"].level) +
                        song.patterns["8B"]["HD"].level +
                        ("floor" in song.patterns["8B"]["HD"] ? " (" + song.patterns["8B"]["HD"].floor + ")" : "")
                    : "-"}
\`MAXIMUM\`: ${song.patterns["8B"]["MX"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["8B"]["MX"].level) +
                        song.patterns["8B"]["MX"].level +
                        ("floor" in song.patterns["8B"]["MX"] ? " (" + song.patterns["8B"]["MX"].floor + ")" : "")
                    : "-"}
\`     SC\`: ${song.patterns["8B"]["SC"]
                    ? (0, starIcons_1.starIcon)(bot, song.patterns["8B"]["SC"].level, true) +
                        song.patterns["8B"]["SC"].level +
                        ("floor" in song.patterns["8B"]["SC"] ? " (" + song.patterns["8B"]["SC"].floor + ")" : "")
                    : "-"}`,
            }, {
                name: " ",
                value: " ",
            }),
            // .setFooter({
            //   text: song.dlc,
            // }),
        ],
    });
});
function findSimilarSong(input, songList) {
    input = (0, simplify_1.simplify)(input);
    let bestMatch = null;
    let bestMatchScore = Infinity;
    // Iterate through each song in the list
    for (const song of songList) {
        // Calculate the Levenshtein distance between the input and the song's fields
        const nameDistance = levenshteinDistance(input, song.name);
        const composerDistance = levenshteinDistance(input, song.composer);
        const dlcDistance = levenshteinDistance(input, DLCNames[song.dlcCode.toUpperCase()]);
        const dlcCodeDistance = levenshteinDistance(input, song.dlcCode);
        const nameWeight = 5;
        const composerWeight = 0.2;
        const dlcWeight = 0.8;
        const dlcCodeWeight = 2;
        // Calculate the average distance
        const distance = nameDistance * nameWeight +
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
function levenshteinDistance(a, b) {
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
            distanceMatrix[i][j] = Math.min(distanceMatrix[i - 1][j] + 1, // deletion
            distanceMatrix[i][j - 1] + 1, // insertion
            distanceMatrix[i - 1][j - 1] + cost // substitution
            );
        }
    }
    // Return the Levenshtein distance between the two strings
    return distanceMatrix[a.length][b.length];
}
