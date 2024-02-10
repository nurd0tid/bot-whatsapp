const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('QR Code Received');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log('Authenticated');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', (msg) => {
    if (msg.body.startsWith('/')) {
        const command = msg.body.slice(1).split(' ')[0]; // Mengambil perintah dari pesan
        try {
            const commandHandler = require(`./commands/${command}.js`);
            commandHandler(client, msg);
        } catch (error) {
            msg.reply(`Command not found: ${command}`);
        }
    }
});

client.initialize();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
