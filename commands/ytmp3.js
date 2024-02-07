const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

module.exports = async (client, msg) => {
    try {
        // Memeriksa apakah pesan yang diterima mengandung URL
        const url = msg.body.slice('/ytmp3'.length).trim();
        if (!url || !ytdl.validateURL(url)) {
            msg.reply('URL YouTube tidak valid.');
            return;
        }

        // Mengunduh audio dari URL YouTube
        const videoInfo = await ytdl.getInfo(url);
        const audioStream = ytdl(url, { filter: 'audioonly' });

        // Menyimpan audio sebagai file sementara
        const fileName = `audio_${Date.now()}.webm`;
        const writeStream = fs.createWriteStream(fileName);
        audioStream.pipe(writeStream);

        writeStream.on('finish', async () => {
            // Mengonversi audio menjadi format MP3 menggunakan ffmpeg
            const mp3FileName = `audio_${Date.now()}.mp3`;
            await new Promise((resolve, reject) => {
                exec(`${ffmpeg} -i ${fileName} -vn -ar 44100 -ac 2 -b:a 192k ${mp3FileName}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error converting audio:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Membuat objek MessageMedia dari file MP3 yang dihasilkan
            const media = MessageMedia.fromFilePath(mp3FileName);

            // Mengirimkan file MP3 kembali kepada pengguna
            await client.sendMessage(msg.from, media, { sendAudioAsVoice: true });

            // Menghapus file sementara
            fs.unlinkSync(fileName);
            fs.unlinkSync(mp3FileName);
        });
    } catch (error) {
        // Menangani kesalahan yang mungkin terjadi
        msg.reply('Terjadi kesalahan saat mengunduh atau mengonversi audio.');
        console.error('Error converting audio:', error);
    }
};
