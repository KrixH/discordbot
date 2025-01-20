module.exports = {
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Hiba a(z) ${interaction.commandName} parancs végrehajtásakor:`, error);
            await interaction.reply({ content: 'Hiba történt a parancs végrehajtásakor.', ephemeral: true });
        }
    },
};
