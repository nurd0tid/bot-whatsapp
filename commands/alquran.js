const axios = require('axios');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = async (client, msg) => {
    try {
        // Split the message body to extract arguments
        const args = msg.body.slice('/alquran'.length).trim().split(/\s+/);
        
        // Find the indices of 'surah' and 'ayat' in the arguments array
        const surahIndex = args.indexOf('surah');
        const ayatIndex = args.indexOf('ayat');

        // Ensure 'surah' and 'ayat' are found in the arguments
        if (surahIndex === -1 || ayatIndex === -1) {
            throw new Error('Invalid command format. Usage: /alquran surah [number] ayat [number]');
        }

        // Extract surah and ayat numbers from the arguments
        const surahNumber = parseInt(args[surahIndex + 1]);
        const ayahNumber = parseInt(args[ayatIndex + 1]);

        // Call the Quran API to get information about the specified verse
        const response = await axios.get(`https://quran-api-id.vercel.app/surahs/${surahNumber}/ayahs/${ayahNumber}`);

        // Extract relevant information from the API response
        const { arab, translation, audio, tafsir } = response.data;

        // Get the short tafsir from Kemenag
        const tafsirKemenagShort = tafsir.kemenag.short;

        // Get the audio URL
        const audioUrl = audio.alafasy;

        // Download the audio file
        const audioFileName = `audio_${Date.now()}.mp3`;
        const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(audioFileName, audioResponse.data);

        // Create a MessageMedia object from the audio file
        const media = MessageMedia.fromFilePath(audioFileName);

        // Send the audio file as a voice message
        await client.sendMessage(msg.from, media, { sendAudioAsVoice: true });

        // Send a text message with other information about the verse
        const replyMessage = `Ayat Al-Quran:\n\n${arab}\n\nTerjemahan:\n${translation}\n\nTafsir Kemenag (Singkat):\n${tafsirKemenagShort}`;
        await client.sendMessage(msg.from, replyMessage);

        // Delete the audio file after sending
        fs.unlinkSync(audioFileName);
    } catch (error) {
        // Handle errors
        msg.reply('Error occurred while fetching Quran information. Please check the command format.');
        console.error('Error fetching Quran information:', error);
    }
};
