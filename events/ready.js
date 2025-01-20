module.exports = {
    once: true,
    execute(client) {
        console.log(`Bejelentkezve mint ${client.user.tag}`);
        client.user.setActivity('Fejlesztés alatt');
    },
};
