const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const JsonManager = require('../utils/jsonManager.js');
const db = new JsonManager('economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Pénzed mennyiségét mutatja')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Kit szeretnél megnézni')
                .setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const userId = target.id;
        
        const userData = await db.get(userId) || {
            money: 100,
            bank: 0,
            lastDaily: 0
        };

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${target.username} egyenlege`)
            .addFields(
                { name: '💰 Készpénz', value: `${userData.money} coin`, inline: true },
                { name: '🏦 Bank', value: `${userData.bank} coin`, inline: true },
                { name: '💳 Összesen', value: `${userData.money + userData.bank} coin`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};