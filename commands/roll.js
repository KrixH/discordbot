const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Dobókocka dobása.')
        .addIntegerOption(option => 
            option.setName('kockák')
                .setDescription('A dobni kívánt kockák száma (alapértelmezett: 1)')
                .setMinValue(1)
                .setMaxValue(10)),
    async execute(interaction) {
        const dice = interaction.options.getInteger('kockák') || 1;
        const results = Array.from({ length: dice }, () => Math.floor(Math.random() * 6) + 1);
        await interaction.reply(`🎲 Dobott értékek: **${results.join(', ')}**`);
    },
};
