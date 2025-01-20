const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (!command.data || !command.data.name) {
        console.error(`Hiba a(z) ${file} parancsfájlban: hiányzik a "data" vagy "name".`);
        continue;
    }
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Parancsok regisztrálása...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Parancsok sikeresen regisztrálva.');
    } catch (error) {
        console.error(error);
    }
})();
