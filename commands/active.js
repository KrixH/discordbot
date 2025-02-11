const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../botActivity.json');

// Funkció az adatok betöltésére
function loadActivityData() {
    try {
        if (!fs.existsSync(dataFile)) return { lastCommandTimestamp: 0 };
        return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
        console.error('Hiba a JSON fájl betöltésekor:', error);
        return { lastCommandTimestamp: 0 };
    }
}

// Funkció az adatok mentésére
function saveActivityData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Hiba a JSON fájl mentésekor:', error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('active')
        .setDescription('Megmutatja az Active Developer Badge státuszát és aktivitási adatokat.'),
    async execute(interaction) {
        const activeDeveloperLink = 'https://discord.com/developers/active-developer';
        const activityData = loadActivityData();
        
        const lastCommandTimestamp = activityData.lastCommandTimestamp || 0;
        const now = Date.now();
        const twentyNineDays = 29 * 24 * 60 * 60 * 1000; // 29 nap

        let activityMessage;
        if (lastCommandTimestamp === 0) {
            activityMessage = "⚠️ A bot **még soha nem hajtott végre parancsot**, így az Active Developer Badge nem igényelhető!";
        } else {
            const lastCommandDate = new Date(lastCommandTimestamp).toLocaleString('hu-HU');
            const expiryDate = new Date(lastCommandTimestamp + twentyNineDays).toLocaleString('hu-HU');

            if (now - lastCommandTimestamp > twentyNineDays) {
                activityMessage = `⚠️ **A bot nem volt aktív az elmúlt 29 napban!**\n📅 **Utolsó aktivitás:** ${lastCommandDate}\n⏳ **Határidő lejárt:** ${expiryDate}`;
            } else {
                activityMessage = `✅ **A bot aktív az elmúlt 29 napban!**\n📅 **Utolsó aktivitás:** ${lastCommandDate}\n⏳ **Határidő lejár:** ${expiryDate}`;
            }
        }

        await interaction.reply(`${activityMessage}\n🔗 [Kattints ide az Active Developer Badge igényléséhez](${activeDeveloperLink})`);
    },
};
