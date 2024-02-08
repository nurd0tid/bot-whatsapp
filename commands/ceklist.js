const fs = require('fs');

module.exports = (client, msg) => {
    // Mencari judul dalam pesan
    const titleMatch = msg.body.match(/Judul\s*\(([^)]+)\)/);

    if (titleMatch) {
        // Judul ditemukan dalam pesan
        const title = titleMatch[1];
        const filename = `${title}.json`;

        if (fs.existsSync(filename)) {
            // File JSON dengan judul tersebut ditemukan
            const jsonData = JSON.parse(fs.readFileSync(filename));
            const userListString = jsonData.userList.length > 0 ? jsonData.userList.map(name => `- ${name}`).join('\n') : '-';

            const replyMessage = `Judul: ${jsonData.title}\nDeskripsi: ${jsonData.description}\nList Nama :\n${userListString}`;
            msg.reply(replyMessage);
        } else {
            msg.reply(`File JSON dengan judul ${title} tidak ditemukan.`);
        }
    } else {
        msg.reply('Format pesan tidak valid. Pastikan Anda menyertakan judul dengan benar.');
    }
};
