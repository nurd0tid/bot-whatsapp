const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

module.exports = async (client, msg) => {
    try {
        // Memeriksa apakah pesan yang diterima memiliki media (gambar)
        if (msg.hasMedia) {
            // Mendapatkan media (gambar) dari pesan
            const media = await msg.downloadMedia();

            // Menyimpan media (gambar) ke file sementara
            const fileName = `image_${Date.now()}.png`;
            fs.writeFileSync(fileName, media.data, 'base64');

            // Mengonversi gambar menjadi stiker
            const stickerMedia = MessageMedia.fromFilePath(fileName);

            // Mengirimkan stiker kembali kepada pengguna
            await client.sendMessage(msg.from, stickerMedia, { sendMediaAsSticker: true });

            // Menghapus file sementara
            fs.unlinkSync(fileName);
        } else {
            // Jika pesan tidak mengandung media, memberikan pesan respon
            msg.reply('Mohon kirimkan gambar untuk dikonversi menjadi stiker.');
        }
    } catch (error) {
        // Menangani kesalahan yang mungkin terjadi
        msg.reply('Terjadi kesalahan saat mengonversi gambar menjadi stiker.');
        console.error('Error converting image to sticker:', error);
    }
};
