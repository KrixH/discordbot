const { SlashCommandBuilder } = require('discord.js');

const questions = [
    { question: 'Mi a legnagyobb bolygó a Naprendszerben?', answer: 'Jupiter' },
    { question: 'Mikor történt az első Holdra szállás?', answer: '1969' },
    { question: 'Mi a Föld legnagyobb óceánja?', answer: 'Csendes-óceán' },
    { question: 'Melyik évben kezdődött a második világháború?', answer: '1939' },
    { question: 'Melyik évben alapították az Egyesült Nemzetek Szervezetét?', answer: '1945' },
    { question: 'Melyik évben született Albert Einstein?', answer: '1879' },
    { question: 'Melyik évben született William Shakespeare?', answer: '1564' },
    { question: 'Melyik évben alapították a Google céget?', answer: '1998' },
    { question: 'Melyik évben alapították a Microsoft céget?', answer: '1975' },
    { question: 'Melyik évben alapították a Facebook céget?', answer: '2004' },
    { question: 'Melyik évben alapították az Apple céget?', answer: '1976' },
    { question: 'Melyik évben alapították az Amazon céget?', answer: '1994' },
    { question: 'Melyik évben alapították a SpaceX céget?', answer: '2002' },
    { question: 'Melyik évben alapították a Tesla céget?', answer: '2003' },
    { question: 'Melyik évben alapították a Twitter céget?', answer: '2006' },
    { question: 'Melyik évben alapították a Snapchat céget?', answer: '2011' },
    { question: 'Melyik évben alapították az Instagram céget?', answer: '2010' },
    { question: 'Melyik évben alapították a WhatsApp céget?', answer: '2009' },
    { question: 'Melyik évben alapították a TikTok céget?', answer: '2016' },
    { question: 'Melyik évben alapították a Reddit céget?', answer: '2005' },
    { question: 'Melyik évben alapították a Discord céget?', answer: '2015' },
    { question: 'Melyik évben alapították a Spotify céget?', answer: '2006' },
    { question: 'Melyik évben alapították a Netflix céget?', answer: '1997' },
    { question: 'Melyik évben alapították a YouTube céget?', answer: '2005' },
    { question: 'Melyik évben alapították a Twitch céget?', answer: '2011' },
    { question: 'Melyik évben alapították a Steam céget?', answer: '2003' },
    { question: 'Melyik évben alapították a Epic Games céget?', answer: '1991' },
    { question: 'Mennyi 9 x 9?', answer: '81' },
    { question: 'Hány lába van egy póknak?', answer: '8' },
    { question: 'Mi a kémiai jele a víznek?', answer: 'H2O' },
    { question: 'Melyik ország fővárosa Párizs?', answer: 'Franciaország' },
    { question: 'Melyik a legmélyebb óceán a Földön?', answer: 'Csendes-óceán' },
    { question: 'Mi a legnagyobb sivatag a világon?', answer: 'Sahara' },
    { question: 'Ki festette a Mona Lisát?', answer: 'Leonardo da Vinci' },
    { question: 'Mi a periódusos rendszer első eleme?', answer: 'Hidrogén' },
    { question: 'Hány perc van egy órában?', answer: '60' },
    { question: 'Melyik országot nevezik a felkelő nap országának?', answer: 'Japán' },
    { question: 'Melyik az emberi test legnagyobb szerve?', answer: 'Bőr' },
    { question: 'Melyik bolygón van a Mount Olympus?', answer: 'Mars' },
    { question: 'Melyik sportban használnak ütőt és labdát, és játszanak 11-en egy csapatban?', answer: 'Krikett' },
    { question: 'Mi az arany kémiai jele?', answer: 'Au' },
    { question: 'Ki írta a \"Hamlet\" című művet?', answer: 'Shakespeare' },
    { question: 'Melyik ókori civilizáció építette a piramisokat?', answer: 'Egyiptom' },
    { question: 'Hány bolygó van a Naprendszerben?', answer: '8' },
    { question: 'Melyik állat a leggyorsabb szárazföldi állat?', answer: 'Gepárd' },
    { question: 'Melyik óceán van Afrika nyugati partjainál?', answer: 'Atlanti-óceán' },
    { question: 'Melyik híres tudós alkotta meg a relativitáselméletet?', answer: 'Einstein' },
    { question: 'Melyik országban található a Nagy-korallzátony?', answer: 'Ausztrália' },
    { question: 'Milyen színű a tiszta oxigén gáz?', answer: 'Színtelen' }

];

const activeTriviaChannels = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Egy trivia kérdés megválaszolása.'),
    async execute(interaction) {
        const channelId = interaction.channel.id;
        if (activeTriviaChannels.has(channelId)) {
            return interaction.reply('⚠️ Már fut egy trivia ebben a csatornában! Várj, amíg véget ér.');
        }
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        await interaction.reply(`❓ **Kérdés**: ${randomQuestion.question}\nÍrd be a válaszod a chaten!`);

        activeTriviaChannels.set(channelId, {
            question: randomQuestion,
            startedAt: Date.now(),
        });

        const filter = (message) => message.channel.id === channelId && message.content.trim().toLowerCase() === randomQuestion.answer.toLowerCase();
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 }); // 1 perc időkorlát

        collector.on('collect', (message) => {
            message.reply('✅ Helyes válasz! Gratulálok!');
            collector.stop('correct');
        });

        collector.on('end', (collected, reason) => {
            if (reason !== 'correct') {
                interaction.followUp(`⏳ Lejárt az idő! A helyes válasz: **${randomQuestion.answer}**.`);
            }
            activeTriviaChannels.delete(channelId);
        });
    },
};
