const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Parancsok betöltése
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    const guildIds = process.env.GUILD_IDS.split(',').map(id => id.trim());

    try {
        for (const guildId of guildIds) {
            console.log(`Parancsok frissítése a szerveren: ${guildId}...`);

            // Parancsok regisztrálása az adott szerverhez
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands }
            );

            console.log(`Parancsok sikeresen frissítve ezen a szerveren: ${guildId}`);
        }
    } catch (error) {
        console.error('Hiba történt a parancsok frissítésekor:', error);
    }
})();
