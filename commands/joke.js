const { SlashCommandBuilder } = require('discord.js');

const jokes = [
    'Miért nem játszik a programozó gitáron? Mert fél, hogy a húr túlcsordul!',
    'Mi az, amit egy programozó mindig szeret? A nullák és egyesek.',
    'Miért nem bíznak meg a fejlesztőben? Mert minden változót meghatározatlanul hagy.',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Véletlenszerű vicc küldése.'),
    async execute(interaction) {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await interaction.reply(`😂 **Vicc**: ${randomJoke}`);
    },
};
