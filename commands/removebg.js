const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async (client, msg) => {
    // Periksa apakah pesan mengandung perintah "/removebg" dan merupakan gambar
    if (!msg.body.startsWith('/removebg') || msg.type !== 'image') {
        // Jika bukan perintah "/removebg" atau bukan gambar, abaikan pesan
        return;
    }

    client.sendMessage(msg.from, 'Sedang diproses, tunggu sebentar...');

    const attachment = await msg.downloadMedia();
    const base64Image = attachment.data.toString('base64');

    try {
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', Buffer.from(base64Image, 'base64'), 'image.jpg');

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': 'your key',
            },
            responseType: 'arraybuffer',
        });

        const outputFileName = `image_${Date.now()}.png`;
        fs.writeFileSync(outputFileName, response.data);

        // Mengonversi gambar menjadi stiker
        const removeBgMedia = MessageMedia.fromFilePath(outputFileName);

        // Proses Pengambilan Image
        await client.sendMessage(
          msg.from, 
          removeBgMedia,
          { sendMediaAsDocument: true },
          { caption: 'Ini hasilnya dengan latar belakang transparan.' });

        // Menghapus file sementara
        fs.unlinkSync(outputFileName);
    } catch (error) {
        console.error('Error removing background:', error);
        await client.sendMessage(msg.from, 'Maaf, terjadi kesalahan dalam menghapus latar belakang gambar.');
    }
};
