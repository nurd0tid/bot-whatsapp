const puppeteer = require('puppeteer');

async function googleSearch(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

        // Tunggu hingga hasil pencarian muncul
        await page.waitForSelector('div.g');

        // Ambil hasil pencarian
        const searchResults = await page.evaluate(() => {
            const results = [];
            const searchElements = document.querySelectorAll('div.g');
            searchElements.forEach(element => {
                const titleElement = element.querySelector('h3');
                const linkElement = element.querySelector('a');
                if (titleElement && linkElement) {
                    results.push({
                        title: titleElement.innerText,
                        link: linkElement.href
                    });
                }
            });
            return results;
        });

        await browser.close();

        return searchResults;
    } catch (error) {
        console.error('Error searching:', error);
        throw error;
    }
}

module.exports = async (client, msg) => {
    // Mendapatkan query pencarian dari pesan
    const query = msg.body.slice('/search'.length).trim();

    try {
        const searchResults = await googleSearch(query);
        if (searchResults.length > 0) {
            let replyMessage = 'Hasil Pencarian:\n\n';
            searchResults.forEach((result, index) => {
                replyMessage += `${index + 1}. ${result.title}\n${result.link}\n\n`;
            });
            msg.reply(replyMessage);
        } else {
            msg.reply('Tidak ada hasil yang ditemukan untuk pencarian ini.');
        }
    } catch (error) {
        msg.reply('Terjadi kesalahan saat melakukan pencarian.');
    }
};
