const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔍 Checking MongoDB URI...');
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is undefined in .env file');
            console.log('Available Env Vars:', Object.keys(process.env));
            throw new Error('MONGO_URI is missing');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
