const fs = require('fs');

module.exports = (client, msg) => {
    // Mencari judul, deskripsi, dan nama dalam pesan
    const titleMatch = msg.body.match(/Judul\s*\(([^)]+)\)/);
    const descriptionMatch = msg.body.match(/Deskripsi\s*\(([^)]+)\)/);
    const nameMatch = msg.body.match(/Nama\s*\(([^)]+)\)/);

    if (titleMatch && descriptionMatch) {
        // Penanganan jika judul dan deskripsi ditemukan
        const title = titleMatch[1];
        const description = descriptionMatch[1];
        const userList = [];

        const data = {
            title: title,
            description: description,
            userList: userList
        };

        const filename = `${title}.json`;
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, JSON.stringify(data));
            const replyMessage = `List berhasil dibuat.\nJudul: ${title}\nDeskripsi: ${description}\n\nSilahkan reply pesan ini dengan mengirimkan command\n/addlist Judul (${title}) Nama (Nama Kamu).`;
            msg.reply(replyMessage);
        } else {
            msg.reply(`Acara dengan judul ${title} sudah ada.`);
        }
    } else if (titleMatch && nameMatch) {
        // Penanganan jika hanya judul dan nama ditemukan
        const title = titleMatch[1];
        const name = nameMatch[1];

        if (title) {
            const filename = `${title}.json`;

            if (fs.existsSync(filename)) {
                const jsonData = JSON.parse(fs.readFileSync(filename));
                jsonData.userList.push(name);
                fs.writeFileSync(filename, JSON.stringify(jsonData));

                const userListString = jsonData.userList.map(name => `- ${name}`).join('\n');
                const descriptionListString = jsonData.description;
                const replyMessage = `Nama "*_${name}_*" telah ditambahkan ke dalam list untuk\n*Judul:* ${title}.\n*Description:* ${descriptionListString}.\n\nList Nama:\n${userListString}`;
                msg.reply(replyMessage);
            } else {
                msg.reply(`File dengan judul ${title} tidak ditemukan.`);
            }
        } else {
            msg.reply('Format pesan tidak valid. Pastikan Anda menyertakan judul dan nama dengan benar.');
        }
    } else {
        // Penanganan jika tidak ada judul dan deskripsi, atau judul dan nama yang ditemukan
        msg.reply('Format pesan tidak valid. Pastikan Anda menyertakan judul dan deskripsi, atau judul dan nama dengan format yang benar.');
    }
};
