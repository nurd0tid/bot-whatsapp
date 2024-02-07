const puppeteer = require('puppeteer');
const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

async function googleImageSearch(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`);

        // Tunggu hingga hasil pencarian gambar muncul
        await page.waitForSelector('img[jsname="Q4LuWd"]');

        // Ambil URL gambar pertama dari hasil pencarian
        const imageUrl = await page.evaluate(() => {
            const imageElement = document.querySelector('img[jsname="Q4LuWd"]');
            return imageElement.src;
        });

        await browser.close();

        return imageUrl;
    } catch (error) {
        console.error('Error searching for image:', error);
        throw error;
    }
}

module.exports = async (client, msg) => {
    // Mendapatkan query pencarian dari pesan
    const query = msg.body.slice('/searchimage'.length).trim();

    try {
        const imageUrl = await googleImageSearch(query);
        if (imageUrl) {
            // Unduh gambar dari URL menggunakan Axios
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            // Buat objek MessageMedia dari data gambar yang diunduh
            const media = new MessageMedia('image/jpeg', imageResponse.data.toString('base64'), 'image.jpg');

            // Kirim gambar sebagai pesan media
            await client.sendMessage(msg.from, media, { caption: 'Ini adalah hasil pencarian gambar.' });
        } else {
            msg.reply('Tidak ada hasil gambar yang ditemukan untuk pencarian ini.');
        }
    } catch (error) {
        msg.reply('Terjadi kesalahan saat melakukan pencarian gambar.');
        console.log(error)
    }
};
