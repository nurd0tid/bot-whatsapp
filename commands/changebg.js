const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js'); // tambahkan ini untuk menggunakan MessageMedia

module.exports = async (client, msg) => {
    // Split pesan untuk mendapatkan perintah dan argumen
    const args = msg.body.slice(1).split(' ');
    const command = args.shift().toLowerCase(); // mengambil perintah, contoh: /changebg
    const backgroundColor = args.join(' '); // mengambil argumen, contoh: blue

    // Validasi perintah
    if (command !== 'changebg' || !backgroundColor) {
        return client.sendMessage(msg.from, 'Format perintah salah. Gunakan: /changebg [warna_background]');
    }

    // Validasi apakah pesan mengandung attachment berupa gambar
    if (msg.type !== 'image') {
        return client.sendMessage(msg.from, 'Maaf, hanya bisa melakukan pengeditan pada format gambar.');
    }

    client.sendMessage(msg.from, 'Sedang diproses, tunggu sebentar.');

    const attachment = await msg.downloadMedia();
    const base64Image = attachment.data.toString('base64');

    try {
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', Buffer.from(base64Image, 'base64'), 'image.jpg');
        formData.append('bg_color', backgroundColor); // Menambahkan warna latar belakang ke formulir data

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': 'your api',
            },
            responseType: 'arraybuffer',
        });

        const outputFileName = `image_${Date.now()}.png`;
        fs.writeFileSync(outputFileName, response.data);

        // Mengonversi gambar menjadi stiker
        const removeBgMedia = MessageMedia.fromFilePath(outputFileName);

        // Proses Pengambilan Image
        await client.sendMessage(msg.from, removeBgMedia, { caption: `ini hasilnya dengan background ${backgroundColor}` });

        // Menghapus file sementara
        fs.unlinkSync(outputFileName);
    } catch (error) {
        console.error('Error removing background:', error);
        await client.sendMessage(msg.from, 'Maaf, terjadi kesalahan dalam menghapus latar belakang foto.');
    }
};
