const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envPath = path.join(__dirname, '.env');

console.log('--- DEBUG START ---');
console.log('Current Directory:', __dirname);
console.log('Checking for .env at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('✅ .env file found!');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('--- .env Content ---');
    console.log(content);
    console.log('--- End .env Content ---');
} else {
    console.error('❌ .env file NOT found!');
}

console.log('process.env.MONGO_URI:', process.env.MONGO_URI);
console.log('--- DEBUG END ---');
