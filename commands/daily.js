const { SlashCommandBuilder } = require('discord.js');
const JsonManager = require('../utils/jsonManager.js');
const db = new JsonManager('economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Napi jutalom begyűjtése'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = await db.get(userId) || { money: 100, lastDaily: 0 };
        
        const now = Date.now();
        const lastDaily = userData.lastDaily || 0;
        const cooldown = 24 * 60 * 60 * 1000; // 24 óra
        
        if (now - lastDaily < cooldown) {
            const remaining = cooldown - (now - lastDaily);
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            
            return interaction.reply(`❌ Már kaptál ma jutalmat! Várnod kell még ${hours} óra ${minutes} percet.`);
        }
        
        const reward = 100 + Math.floor(Math.random() * 50); // 100-150 coin
        userData.money = (userData.money || 0) + reward;
        userData.lastDaily = now;
        
        await db.set(userId, userData);
        
        await interaction.reply(`✅ Sikeresen kaptál **${reward} coin** jutalmat! Új egyenleg: **${userData.money} coin**`);
    }
};