const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('A bot állapotának módosítása (csak fejlesztő)')
        .addStringOption(option =>
            option.setName('üzenet')
                .setDescription('Az állapot üzenete')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('típus')
                .setDescription('Az állapot típusa')
                .setRequired(false)
                .addChoices(
                    { name: 'Játék', value: 'Playing' },
                    { name: 'Hallgat', value: 'Listening' },
                    { name: 'Néz', value: 'Watching' },
                    { name: 'Verseny', value: 'Competing' }
                )),
    async execute(interaction) {
        // Csak a fejlesztő használhatja
        if (interaction.user.id !== process.env.DEVELOPER_ID) {
            return interaction.reply({ 
                content: '❌ Nincs jogosultságod ehhez a parancshoz!', 
                ephemeral: true 
            });
        }

        const message = interaction.options.getString('üzenet');
        const type = interaction.options.getString('típus') || 'Playing';

        const typeMap = {
            'Playing': ActivityType.Playing,
            'Listening': ActivityType.Listening,
            'Watching': ActivityType.Watching,
            'Competing': ActivityType.Competing
        };

        interaction.client.user.setActivity(message, { 
            type: typeMap[type] || ActivityType.Playing 
        });

        await interaction.reply({ 
            content: `✅ Bot állapota frissítve: **${message}** (${type})`, 
            ephemeral: true 
        });
    },
};