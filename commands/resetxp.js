const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const JsonManager = require('../utils/jsonManager.js');
const xpDb = new JsonManager('levels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetxp')
        .setDescription('XP visszaállítása (csak admin)')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Kinek a XP-jét állítsuk vissza')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('scope')
                .setDescription('Mit állítsunk vissza?')
                .setRequired(true)
                .addChoices(
                    { name: 'Globális', value: 'global' },
                    { name: 'Szerver', value: 'guild' },
                    { name: 'Mindkettő', value: 'all' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const scope = interaction.options.getString('scope');
        const guildId = interaction.guild.id;
        
        const userData = await xpDb.get(target.id) || {};
        
        if (scope === 'global' || scope === 'all') {
            userData.xp = 0;
            userData.level = 1;
            userData.messages = 0;
        }
        
        if (scope === 'guild' || scope === 'all') {
            if (!userData.guilds) userData.guilds = {};
            userData.guilds[guildId] = {
                xp: 0,
                messages: 0,
                lastXp: 0,
                level: 1
            };
        }
        
        await xpDb.set(target.id, userData);
        
        await interaction.reply({
            content: `✅ ${target.username} XP adatai visszaállítva (scope: ${scope})`,
            ephemeral: true
        });
    }
};