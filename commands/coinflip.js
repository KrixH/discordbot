const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Pénzfeldobás: fej vagy írás.'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Fej' : 'Írás';
        await interaction.reply(`🪙 A pénzfeldobás eredménye: **${result}**`);
    },
};
