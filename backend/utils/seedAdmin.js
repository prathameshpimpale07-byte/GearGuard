const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@gearguard.com' });

        if (adminExists) {
            console.log('⚠️ Admin user "admin@gearguard.com" already exists.');
            process.exit(0);
        }

        // Create Admin
        await User.create({
            name: 'System Admin',
            email: 'admin@gearguard.com',
            password: 'password123',
            role: 'admin'
        });

        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email: admin@gearguard.com');
        console.log('🔑 Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
