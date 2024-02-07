const { chatGPTResponse } = require('./chatgpt/ask');

module.exports = async (client, msg) => {
    const question = msg.body.slice(6).trim(); // Mengambil pertanyaan tanpa "/ask "
    const answer = await chatGPTResponse(question); // Menggunakan ChatGPT untuk mendapatkan jawaban
    msg.reply(answer);
};
