const puppeteer = require('puppeteer');

async function translateText(text, targetLang) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate`);

        // Tunggu hingga teks terjemahan muncul
        await page.waitForSelector('span[jsname="W297wb"]');

        // Ambil teks terjemahan
        const translatedText = await page.evaluate(() => {
            const translationElement = document.querySelector('span[jsname="W297wb"]');
            return translationElement.textContent.trim();
        });

        return translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = async (client, msg) => {
    // Mengambil teks yang ingin diterjemahkan
    const textToTranslate = msg.body.slice('/translate'.length).trim();
    const targetLang = 'id'; // Terjemahkan ke bahasa Indonesia

    try {
        const translatedText = await translateText(textToTranslate, targetLang);
        msg.reply(`Terjemahan: ${translatedText}`);
    } catch (error) {
        msg.reply('Terjadi kesalahan saat menerjemahkan teks.');
    }
};
