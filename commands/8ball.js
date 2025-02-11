const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Tedd fel a kérdésed, és a 8Ball válaszol.')
        .addStringOption(option => 
            option.setName('kérdés')
                .setDescription('Írd be a kérdésed.')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('kérdés');
        const responses = [
            'Igen, biztosan!',
            'Nem, soha!',
            'Talán...',
            'Nem tudom.',
            'Valószínűleg igen.',
            'Nem hiszem.',
            'Teljesen biztos!',
            'Kétséges.',
        ];
        const answer = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply(`🎱 Kérdés: **${question}**\nVálasz: **${answer}**`);
    },
};
