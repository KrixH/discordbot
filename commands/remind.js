const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Emlékeztető beállítása.')
        .addStringOption(option => 
            option.setName('idő')
                .setDescription('Add meg, mennyi idő múlva (pl. 10s, 5m, 1h).')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('üzenet')
                .setDescription('Az üzenet, amit küldeni szeretnél.')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('idő');
        const message = interaction.options.getString('üzenet');
        const duration = parseTimeToMilliseconds(time);

        if (!duration) {
            return interaction.reply('⏰ Helytelen időformátum. Példák: 10s, 5m, 1h.');
        }

        await interaction.reply(`⏳ Emlékeztetni foglak: **${message}** ${time} múlva.`);
        setTimeout(() => {
            interaction.followUp(`🔔 **Emlékeztető**: ${message}`);
        }, duration);
    },
};

function parseTimeToMilliseconds(time) {
    const match = time.match(/^(\d+)(s|m|h)$/);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 's') return value * 1000;
    if (unit === 'm') return value * 60 * 1000;
    if (unit === 'h') return value * 60 * 60 * 1000;
    return null;
}
