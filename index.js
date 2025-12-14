require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Bot inicializálása
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Parancsok és események betöltése
client.commands = new Collection();

// Parancsok betöltése
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

// Események betöltése
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    const eventName = file.split('.')[0];
    if (event.once) {
        client.once(eventName, (...args) => event.execute(...args, client));
    } else {
        client.on(eventName, (...args) => event.execute(...args, client));
    }
}

// Initialize member count tracker
require('./events/updateMemberCount')(client);

// Bot bejelentkezése
client.login(process.env.DISCORD_TOKEN);
