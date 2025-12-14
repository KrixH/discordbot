const { ActivityType } = require('discord.js');

module.exports = {
    once: true,
    execute(client) {
        console.log(`Bejelentkezve mint ${client.user.tag}`);
        
        // Dinamikus állapot frissítése
        const updatePresence = () => {
            const guildCount = client.guilds.cache.size;
            const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            
            const presences = [
                {
                    name: `${guildCount} szerveren elérhető`,
                    type: ActivityType.Watching
                },
                {
                    name: '/help | Fejlesztés alatt',
                    type: ActivityType.Playing
                }
            ];
            
            const presence = presences[Math.floor(Math.random() * presences.length)];
            client.user.setActivity(presence.name, { type: presence.type });
        };
        
        // Frissítés induláskor, majd 5 percenként
        updatePresence();
        setInterval(updatePresence, 5 * 60 * 1000);
    },
};