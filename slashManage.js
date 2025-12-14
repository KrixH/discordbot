const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Command loading
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

// Deployment strategy configuration
const DEPLOYMENT_MODE = process.env.DEPLOYMENT_MODE || 'guild'; // 'guild' or 'global'
const GUILD_IDS = process.env.GUILD_IDS ? 
    process.env.GUILD_IDS.split(',').map(id => id.trim()).filter(id => id) : 
    [];

(async () => {
    try {
        console.log(`Starting ${commands.length} command(s) deployment in ${DEPLOYMENT_MODE} mode...`);

        if (DEPLOYMENT_MODE === 'guild') {
            if (GUILD_IDS.length === 0) {
                throw new Error('GUILD_IDS is required for guild-specific deployment');
            }

            // Deploy to each guild
            for (const guildId of GUILD_IDS) {
                console.log(`Deploying commands to guild: ${guildId}`);
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                    { body: commands }
                );
                console.log(`Successfully deployed commands to guild: ${guildId}`);
            }
        } else {
            // Global deployment
            console.log('Deploying commands globally (this may take up to an hour to propagate)');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('Successfully deployed commands globally');
        }

        console.log('Command deployment completed successfully');
    } catch (error) {
        console.error('Command deployment failed:', error);
        process.exit(1);
    }
})();