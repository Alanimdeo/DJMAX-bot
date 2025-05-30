import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Bot, Command } from "../types";

enum TierColor {
  "BG" = "#404040",
  "AM" = "#404040",
  "IR" = "#646464",
  "BR" = "#fa5018",
  "SV" = "#4b82fa",
  "GD" = "#ffff1c",
  "PT" = "#33ff6d",
  "DM" = "#cad1e3",
  "M" = "#fbfffa",
  "GM" = "#e20040",
}

type UserTier =
  | {
      success: true;
      top50sum: number;
      tierPoint: number;
      tier: Tier;
      next: Tier;
    }
  | {
      success: false;
      message: string;
    };

type Tier = {
  rating: number;
  name: string;
  code: keyof typeof TierColor;
};

module.exports = new Command(
  new SlashCommandBuilder()
    .setName("티어")
    .setDescription("V-ARCHIVE 티어 정보를 검색합니다.")
    .addStringOption((option) =>
      option
        .setName("닉네임")
        .setDescription("검색할 닉네임을 입력하세요.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("버튼")
        .setDescription("검색할 버튼을 선택하세요.")
        .setRequired(true)
        .addChoices(
          {
            name: "4B",
            value: "4",
          },
          {
            name: "5B",
            value: "5",
          },
          {
            name: "6B",
            value: "6",
          },
          {
            name: "8B",
            value: "8",
          }
        )
    ),
  async (message: ChatInputCommandInteraction, bot: Bot) => {
    await message.deferReply();
    const nickname = message.options.getString("닉네임", true);
    const button = message.options.getString("버튼", true);
    const result: UserTier = await fetch(
      `https://v-archive.net/api/archive/${nickname}/tier/${button}`
    ).then((res) => res.json());

    if (!result.success) {
      await message.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle(":warning: 오류")
            .setDescription(result.message),
        ],
      });
      return;
    }

    await message.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(TierColor[result.tier.code])
          .setAuthor({
            name: `${nickname} 님의 ${button}B 티어`,
            url: `https://v-archive.net/archive/${nickname}/tier/${button}`,
          })
          .setTitle(result.tier.name)
          .setThumbnail(
            `https://v-archive.net/static/images/tier/${result.tier.code}.jpg`
          )
          .setDescription(
            `TOP 50 합계: ${result.top50sum}\n환산 포인트: ${result.tierPoint}`
          )
          .addFields({
            name: "NEXT",
            value: `${result.next.name} (${result.next.rating})`,
          })

          .setFooter({ text: "Provided by V-ARCHIVE" }),
      ],
    });
  }
);
