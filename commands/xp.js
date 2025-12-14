const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const JsonManager = require('../utils/jsonManager.js');
const xpDb = new JsonManager('levels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('XP információk megjelenítése')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Kit szeretnél megnézni')
                .setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const userId = target.id;
        const guildId = interaction.guild.id;
        
        const userData = await xpDb.get(userId) || { 
            xp: 0, 
            level: 1, 
            messages: 0,
            guilds: {}
        };
        
        const guildData = userData.guilds?.[guildId] || { xp: 0, messages: 0 };
        
        // Számítások
        const globalLevel = calculateLevel(userData.xp);
        const guildLevel = calculateLevel(guildData.xp);
        const xpForNextGlobal = xpForNextLevel(globalLevel);
        const xpForNextGuild = xpForNextLevel(guildLevel);
        
        const globalProgress = (userData.xp / xpForNextGlobal * 100).toFixed(1);
        const guildProgress = (guildData.xp / xpForNextGuild * 100).toFixed(1);
        
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`${target.username} XP adatai`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { 
                    name: '🌍 Globális', 
                    value: `**Szint:** ${globalLevel}\n**XP:** ${userData.xp}/${xpForNextGlobal}\n**Haladás:** ${globalProgress}%\n**Üzenetek:** ${userData.messages}`,
                    inline: true 
                },
                { 
                    name: `🏰 ${interaction.guild.name}`, 
                    value: `**Szint:** ${guildLevel}\n**XP:** ${guildData.xp}/${xpForNextGuild}\n**Haladás:** ${guildProgress}%\n**Üzenetek:** ${guildData.messages}`,
                    inline: true 
                }
            )
            .setFooter({ text: 'XP-t kapsz minden 1 percben küldött üzenetért!' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

function calculateLevel(xp) {
    if (xp < 100) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function xpForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
}