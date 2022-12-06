const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("echo").setDescription("echo2"),
  async execute(interaction) {
    await interaction.reply({ content: "change23", ephemeral: true });
  },
};
