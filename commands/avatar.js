const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Megjeleníti a felhasználó avatarját.')
        .addUserOption(option =>
            option.setName('felhasználó')
                .setDescription('A felhasználó, akinek az avatarját látni szeretnéd')
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('felhasználó') || interaction.user;
        await interaction.reply(`${user.username} avatarja: ${user.displayAvatarURL({ dynamic: true, size: 1024 })}`);
    },
};
