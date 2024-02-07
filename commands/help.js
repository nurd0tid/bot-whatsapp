module.exports = (client, msg) => {
    const helpMessage = '*WhatsApp Bot v1.0*\n\nBy: *nurd0tid*\nGithub: https://github.com/nurd0tid\nPortfolio: https://nurd0tid.netlify.app/\n\n Fitur Bantuan:\n\n' +
                        '*_/help_* - Menampilkan daftar fitur bantuan\n' +
                        '*_/search_* [Google] - Mencari Jawaban via Google\n' +
                        '*_/searchimage_* [Google Image] - Mencari Image via Google\n' +
                        '*_/translate_* [English] - Translate bahasa inggris ke indonesia\n' +
                        '*_/kalkualtor_* [Ex: 5 + 5] - Perhitungan menggunakan kalkulator\n' +
                        '*_/alkitab_* [book Kejadian num 1] - Perhitungan menggunakan kalkulator\n' +
                        '*_/stiker_* [gambar] - Merubah Gambar menjadi Stiker\n' + 
                        '*_/ytmp3_* [url] - Merubah Video Youtube Menjadi Mp3\n'+ 
                        'Donasi via\n\n' +
                        'Saweria: https://saweria.co/itsPOPOY';
    
    // Mengirim pesan dengan pesan bantuan dan tombol untuk Saweria
    msg.reply(helpMessage);
};
