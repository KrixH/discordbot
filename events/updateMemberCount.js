const { ChannelType } = require('discord.js');

module.exports = (client) => {
    const channelId = process.env.MEMBER_COUNT_CHANNEL_ID;
    if (!channelId) {
        console.log('[Member Count] No channel ID set in .env file');
        return;
    }

    const updateChannel = async () => {
        try {
            const channel = await client.channels.fetch(channelId);
            
            if (!channel) {
                console.log('[Member Count] Channel not found');
                return;
            }

            if (channel.type !== ChannelType.GuildVoice) {
                console.log('[Member Count] Channel must be a voice channel');
                return;
            }

            const memberCount = channel.guild.memberCount;
            const newName = `👥 Members: ${memberCount}`;

            if (channel.name !== newName) {
                await channel.setName(newName);
                console.log(`[Member Count] Updated to: ${memberCount}`);
            }
        } catch (error) {
            console.error('[Member Count] Error:', error.message);
        }
    };

    // Update on bot start
    client.once('ready', () => {
        console.log('[Member Count] Starting member count tracker');
        updateChannel();
    });

    // Update when members join/leave
    client.on('guildMemberAdd', updateChannel);
    client.on('guildMemberRemove', updateChannel);

    // Update every hour as backup
    setInterval(updateChannel, 3600000);
};