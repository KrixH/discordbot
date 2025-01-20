const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Szia üzenetet küld vissza.'),
    async execute(interaction) {
        await interaction.reply(`Szia, ${interaction.user}!`);
    },
};
