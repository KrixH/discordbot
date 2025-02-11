const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../botActivity.json');

function saveActivityData(timestamp) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify({ lastCommandTimestamp: timestamp }, null, 4));
    } catch (error) {
        console.error('Hiba a JSON fájl mentésekor:', error);
    }
}

module.exports = {
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);

            // Aktivitás mentése minden parancshíváskor
            saveActivityData(Date.now());
        } catch (error) {
            console.error(`Hiba a(z) ${interaction.commandName} parancs végrehajtásakor:`, error);
            await interaction.reply({ content: 'Hiba történt a parancs végrehajtásakor.', ephemeral: true });
        }
    },
};
