// brainly.js

const { Brainly } = require("brainly-scraper-v2");

// Inisialisasi Brainly
Brainly.initialize();

module.exports = async (client, msg) => {
    try {
        const query = msg.body.slice(9); // Mengambil pertanyaan dari pesan (menghapus '/brainly ')
        
        const brain = new Brainly("id"); // Inisialisasi Brainly dengan kode negara 'id' (Indonesia)

        // Cari jawaban menggunakan metode search()
        const results = await brain.search(query);

        // Mengirimkan jawaban pertama kembali kepada pengguna
        if (results && results.length > 0) {
            const question = results[0].question.content;
            const answer = results[0].answers[0].content;

            await client.sendMessage(msg.from, `Pertanyaan: ${question}\nJawaban: ${answer}`);
        } else {
            await client.sendMessage(msg.from, `Maaf, tidak ditemukan jawaban untuk pertanyaan "${query}".`);
        }
    } catch (error) {
        console.error('Error handling /brainly command:', error);
        msg.reply('Terjadi kesalahan saat mencari jawaban. Silakan coba lagi nanti.');
    }
};
