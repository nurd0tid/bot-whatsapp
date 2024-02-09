const { OpenAI, OpenAIApi } = require("openai");

// Inisialisasi dengan kunci API Anda
const openai = new OpenAI({
    apiKey: "your api"
});

module.exports = async (client, msg) => {
    const question = msg.body.slice(6).trim(); // Mengambil pertanyaan tanpa "/ask "

    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: question }],
            model: "gpt-3.5-turbo",
        });

        console.log(response)
        msg.reply(response.data.choices[0].text.trim())
    } catch (error) {
        console.log(error)
        msg.reply('Jika ingin menggunakan fitur ini, gunakan api key berbayar ya :).');
    }
};
