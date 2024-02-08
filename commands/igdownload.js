// Comming Soon

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { MessageMedia } = require('whatsapp-web.js');
// const { default: axios } = require('axios');

// module.exports = async (client, msg) => {
//     try {
//         const url = msg.body.split(' ')[1]; // Mendapatkan URL Instagram dari pesan

//         if (!url || !url.startsWith('https://www.instagram.com/')) {
//             return msg.reply('Mohon berikan tautan Instagram yang valid.');
//         }

//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Buka halaman Instagram menggunakan Puppeteer
//         await page.goto(url);

//         // Tunggu hingga video muncul di halaman
//         await page.waitForSelector('video');

//         // Dapatkan URL video
//         const videoUrl = await page.evaluate(() => {
//             const videoElement = document.querySelector('video');
//             return videoElement.src;
//         });

//         await browser.close();

//         // Unduh video
//         const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });

//         // Menghasilkan nama file unik untuk menyimpan video sementara
//         const fileName = `video_${Date.now()}.mp4`;

//         // Menyimpan video sementara
//         fs.writeFileSync(fileName, response.data);

//         // Membuat objek MessageMedia dari file video
//         const videoMedia = MessageMedia.fromFilePath(fileName);

//         // Mengirim video kembali kepada pengguna
//         await client.sendMessage(msg.from, videoMedia);

//         // Menghapus file video sementara setelah dikirim
//         fs.unlinkSync(fileName);
//     } catch (error) {
//         // Menangani kesalahan yang mungkin terjadi
//         msg.reply('Terjadi kesalahan saat mengunduh dan mengirimkan video.');
//         console.error('Error downloading and sending video:', error);
//     }
// };
