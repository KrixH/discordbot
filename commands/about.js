const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Információt ad a botról és a fejlesztőjéről.'),
    async execute(interaction) {
        const developerId = process.env.DEVELOPER_ID;
        const developerName = process.env.DEVELOPER_NAME;

        await interaction.reply({
            content: `👨‍💻 **Fejlesztő:** ${developerName} (ID: ${developerId})\n💡 **Bot Verzió:** ${version}\n🔗 **GitHub:** https://github.com/KrixH/discordbot`,
            ephemeral: true,
        });
    },
};
