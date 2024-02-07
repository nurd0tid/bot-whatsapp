const puppeteer = require('puppeteer');

async function evaluateExpression(expression) {
    try {
        const result = eval(expression); // Fungsi eval() mengevaluasi string sebagai kode JavaScript
        return result;
    } catch (error) {
        console.error('Error evaluating expression:', error);
        throw error;
    }
}

module.exports = async (client, msg) => {
    const expression = msg.body.slice('/kalkulator'.length).trim();

    // Memisahkan ekspresi berdasarkan operator matematika dengan menggunakan regular expression
    const parts = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/)/g);

    try {
        let result = parseFloat(parts[0]); // Menginisialisasi hasil dengan angka pertama

        // Mengiterasi melalui bagian-bagian ekspresi untuk menangani operasi matematika
        for (let i = 1; i < parts.length; i += 2) {
            const operator = parts[i];
            const operand = parseFloat(parts[i + 1]);

            // Memeriksa apakah operand valid
            if (isNaN(operand)) {
                throw new Error('Operand tidak valid.');
            }

            // Menangani operasi matematika sesuai dengan operator
            if (operator === '+') {
                result += operand;
            } else if (operator === '-') {
                result -= operand;
            } else if (operator === '*') {
                result *= operand;
            } else if (operator === '/') {
                if (operand === 0) {
                    throw new Error('Pembagian dengan nol tidak diperbolehkan.');
                }
                result /= operand;
            }
        }

        msg.reply(`Hasil kalkulasi: ${result}`);
    } catch (error) {
        msg.reply('Terjadi kesalahan saat melakukan kalkulasi: ' + error.message);
    }
};
