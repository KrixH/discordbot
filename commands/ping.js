const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Visszaadja a Pong! üzenetet.'),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong! ${interaction.user}`);
    },
};
