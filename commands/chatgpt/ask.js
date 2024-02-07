const { OpenAI, OpenAIApi } = require("openai");

// Inisialisasi dengan kunci API Anda
const openai = new OpenAI({
    apiKey: "key" // This is also the default, can be omitted
});

// Fungsi untuk memanggil OpenAI API dan mendapatkan jawaban dari ChatGPT
async function getChatGPTResponse(question) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            prompt: question,
            temperature: 0,
            max_tokens: 300,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        return 'Comming Soon.';
    }
}

module.exports = { chatGPTResponse: getChatGPTResponse };
