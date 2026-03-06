import dbConnect from './src/lib/db.js';
import { User } from './src/models/Schemas.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkUsers() {
    try {
        await dbConnect();
        const users = await User.find({});
        console.log('Current users in DB:');
        users.forEach(u => {
            console.log(`- Username: "${u.username}", Role: ${u.role}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUsers();
