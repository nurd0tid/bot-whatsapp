const axios = require('axios');

async function fetchBibleVerse(book, num) {
    try {
        const response = await axios.get(`https://api-alkitab.vercel.app/api/passage?passage=${book}&num=${num}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Bible verse:', error);
        throw error;
    }
}

module.exports = async (client, msg) => {
    // Parsing pesan dari pengguna menggunakan regex
    const input = msg.body.trim(); // Menghapus spasi ekstra di awal dan akhir pesan
    const regex = /^\/alkitab\s+book\s+(\S+)\s+num\s+(\d+)$/i; // Regex untuk mencocokkan format pesan
    const match = input.match(regex);

    // Memeriksa apakah pesan cocok dengan format yang diharapkan
    if (!match) {
        msg.reply('Format yang benar: /alkitab book <nama_buku> num <nomor_ayat>');
        return;
    }

    // Mendapatkan nama buku dan nomor ayat dari hasil regex
    const book = match[1];
    const num = match[2];
    
    try {
        const result = await fetchBibleVerse(book, num);
        if (result.bible && result.bible.title) {
            const verses = result.bible.book.chapter.verses;
            let verseText = '';
            verses.forEach(verse => {
                verseText += `${verse.number}. ${verse.text}\n`;
            });
            msg.reply(`${result.bible.title}:\n${verseText}`);
        } else {
            msg.reply('Ayat tidak ditemukan.');
        }
    } catch (error) {
        console.error('Error fetching Bible verse:', error);
        msg.reply('Maaf, terjadi kesalahan dalam memuat ayat Alkitab.');
    }
};
