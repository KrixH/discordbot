const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Megjeleníti a felhasználó információit.'),
    async execute(interaction) {
        const user = interaction.user;
        await interaction.reply(`Felhasználó neve: ${user.username}\nID: ${user.id}`);
    },
};
