const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Számolja, hány nap van hátra egy eseményig.')
        .addStringOption(option => 
            option.setName('dátum')
                .setDescription('Add meg az esemény dátumát (YYYY-MM-DD).')
                .setRequired(true)),
    async execute(interaction) {
        const date = interaction.options.getString('dátum');
        const targetDate = new Date(date);
        const now = new Date();

        if (isNaN(targetDate.getTime())) {
            return interaction.reply('📅 Hibás dátumformátum. Használj YYYY-MM-DD formátumot!');
        }

        const diff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
            return interaction.reply('📅 Az esemény már elmúlt.');
        }

        await interaction.reply(`⏳ **${diff} nap van hátra** a megadott dátumig.`);
    },
};
