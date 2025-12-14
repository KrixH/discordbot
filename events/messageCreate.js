const { prefix } = require('../config.json');
const JsonManager = require('../utils/jsonManager.js');
const xpDb = new JsonManager('levels');

module.exports = {
    async execute(message, client) {
        // Bot üzenetek figyelmen kívül hagyása
        if (message.author.bot) return;

        // 1️⃣ AUTOMATIKUS XP RENDSZER
        await handleXP(message);

        // 2️⃣ PREFIX PARANCSOK (ha van config.json-ben prefix)
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Hiba a(z) ${commandName} parancs futtatásakor:`, error);
            
            // Hibajelentés küldése
            const errorEmbed = {
                color: 0xff0000,
                title: '❌ Hiba történt!',
                description: 'Hiba történt a parancs végrehajtásakor.',
                fields: [
                    {
                        name: 'Parancs',
                        value: `\`${prefix}${commandName}\``,
                        inline: true
                    },
                    {
                        name: 'Hiba',
                        value: `\`\`\`${error.message}\`\`\``,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString()
            };
            
            // Privát üzenetben küldjük el a hibát
            try {
                await message.author.send({ embeds: [errorEmbed] });
                if (message.guild) {
                    await message.react('❌'); // Reakció a hibára
                }
            } catch (dmError) {
                // Ha nem lehet DM-et küldeni, küldjük a csatornába
                await message.reply({ 
                    content: '❌ Hiba történt a parancs végrehajtásakor!', 
                    embeds: [errorEmbed] 
                });
            }
        }
    }
};

/**
 * Automatikus XP adás minden üzenetért
 * @param {Message} message - A Discord üzenet objektum
 */
async function handleXP(message) {
    try {
        const userId = message.author.id;
        const guildId = message.guild?.id;
        
        // Csak szervereken adjunk XP-t
        if (!guildId) return;
        
        // Adatok betöltése
        const userData = await xpDb.get(userId) || { 
            xp: 0, 
            level: 1, 
            messages: 0,
            lastXp: 0,
            guilds: {}
        };
        
        // Szerver-specifikus adatok inicializálása
        if (!userData.guilds[guildId]) {
            userData.guilds[guildId] = {
                xp: 0,
                messages: 0,
                lastXp: 0
            };
        }
        
        const guildData = userData.guilds[guildId];
        
        // COOLDOWN: 1 percenként kaphat XP-t
        const now = Date.now();
        const cooldown = 60 * 1000; // 1 perc
        
        if (now - guildData.lastXp < cooldown) {
            return; // Még cooldown-ban van
        }
        
        // XP kalkuláció
        const baseXP = 10;
        
        // Bónusz XP-ek:
        let bonusXP = 0;
        
        // 1. Hosszú üzenet bónusz
        if (message.content.length > 100) bonusXP += 5;
        if (message.content.length > 200) bonusXP += 10;
        
        // 2. Linkek/mentions nélküli üzenet bónusz
        const hasLink = /https?:\/\/[^\s]+/.test(message.content);
        const hasMention = /<@!?\d+>/.test(message.content);
        if (!hasLink && !hasMention) bonusXP += 2;
        
        // 3. Képes üzenet bónusz
        if (message.attachments.size > 0) bonusXP += 3;
        
        // Végső XP számítás (5-25 XP között)
        const xpGain = Math.min(baseXP + bonusXP, 25);
        
        // XP hozzáadása
        guildData.xp += xpGain;
        userData.xp += xpGain; // Globális XP is
        guildData.messages += 1;
        userData.messages += 1;
        guildData.lastXp = now;
        userData.lastXp = now;
        
        // Szint számítás ehhez a szerverhez
        const levelForGuild = calculateLevel(guildData.xp);
        
        // Globális szint számítás
        const globalLevel = calculateLevel(userData.xp);
        
        // Szintlépés ellenőrzése (globális)
        if (globalLevel > userData.level) {
            userData.level = globalLevel;
            
            // Szintlépés értesítés
            const levelUpChannel = message.channel;
            
            const levelUpEmbed = {
                color: 0x00ff00,
                title: '🎉 Szintlépés!',
                description: `**${message.author.username}** elérte a(z) **${globalLevel}. szintet**!`,
                fields: [
                    {
                        name: 'Globális XP',
                        value: `${userData.xp} XP`,
                        inline: true
                    },
                    {
                        name: 'Szerver XP',
                        value: `${guildData.xp} XP (${guildId})`,
                        inline: true
                    },
                    {
                        name: 'Üzenetek',
                        value: `${userData.messages} db`,
                        inline: true
                    }
                ],
                thumbnail: {
                    url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date().toISOString()
            };
            
            try {
                await levelUpChannel.send({ 
                    content: `🎉 <@${userId}>`, 
                    embeds: [levelUpEmbed] 
                });
            } catch (channelError) {
                console.error('Nem sikerült elküldeni a szintlépés üzenetet:', channelError);
            }
        }
        
        // Szerver-specifikus szintlépés ellenőrzése
        if (levelForGuild > (guildData.level || 1)) {
            guildData.level = levelForGuild;
            
            // Szerver-specifikus rang rendszer itt implementálható
            // pl: automatikus szerep adás a szint alapján
        }
        
        // Adatok mentése
        await xpDb.set(userId, userData);
        
        // RITKA DEBUG üzenet (csak 1% eséllyel)
        if (Math.random() < 0.01) {
            console.log(`[XP] ${message.author.tag}: +${xpGain}XP (Összes: ${userData.xp})`);
        }
        
    } catch (error) {
        console.error('Hiba az XP kezelésekor:', error);
    }
}

/**
 * XP-ből szint számítás
 * @param {number} xp - XP pontok
 * @returns {number} - Szint
 */
function calculateLevel(xp) {
    // Forma: level^2 * 100 = szükséges XP a következő szinthez
    // 1. szint: 0-99 XP
    // 2. szint: 100-399 XP
    // 3. szint: 400-899 XP, stb.
    
    if (xp < 100) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * XP szükséglet a következő szinthez
 * @param {number} currentLevel - Jelenlegi szint
 * @returns {number} - Szükséges XP
 */
function xpForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
}