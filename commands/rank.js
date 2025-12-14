const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const JsonManager = require('../utils/jsonManager.js');
const xpDb = new JsonManager('levels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('A szintedet és XP-det mutatja')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Kit szeretnél megnézni')
                .setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const userId = target.id;
        
        const userData = await xpDb.get(userId) || { xp: 0, level: 1, messages: 0 };
        
        // XP számítás
        const xpNeeded = userData.level * 100;
        const progress = (userData.xp % 100);
        const progressBar = createProgressBar(progress, 100);
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(`${target.username} szintje`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '📊 Szint', value: `${userData.level}`, inline: true },
                { name: '⭐ XP', value: `${userData.xp}/${xpNeeded}`, inline: true },
                { name: '💬 Üzenetek', value: `${userData.messages}`, inline: true },
                { name: '📈 Haladás', value: progressBar }
            )
            .setFooter({ text: `Következő szint: ${xpNeeded - userData.xp} XP kell még` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

function createProgressBar(current, max, size = 10) {
    const percentage = current / max;
    const progress = Math.round(size * percentage);
    const empty = size - progress;
    return `[${'█'.repeat(progress)}${'░'.repeat(empty)}] ${Math.round(percentage * 100)}%`;
}