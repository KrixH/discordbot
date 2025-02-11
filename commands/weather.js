const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Időjárás információ megtekintése.')
        .addStringOption(option => 
            option.setName('város')
                .setDescription('Add meg a város nevét.')
                .setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('város');
        await interaction.reply(`🌦 **Időjárás információ**: [Nézd meg itt](https://www.google.com/search?q=weather+${encodeURIComponent(city)})`);
    },
};
