const config = require('../config.json');

module.exports = {
    async execute(message, client) {
        if (message.author.bot) return;

        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Hiba a(z) ${commandName} parancs futtatásakor:`, error);
            message.reply('Hiba történt a parancs végrehajtásakor.');
        }
    },
};
