const mongoose = require('mongoose');
const Table = require('../models/Table');
const QRCode = require('qrcode');
require('dotenv').config();

// Hardcode the correct URL to be safe, or use process.env
const FRONTEND_URL = 'https://cafe-chaska-web.vercel.app';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe_chaska';

console.log('Regenerating QR Codes with Base URL:', FRONTEND_URL);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const tables = await Table.find({});
        console.log(`Found ${tables.length} tables to update.`);

        for (const t of tables) {
            const scanUrl = `${FRONTEND_URL}/scan/${t.cafeId}/${t.id}`;
            const qrCodeData = await QRCode.toDataURL(scanUrl);
            t.qrCodeData = qrCodeData;
            await t.save();
            console.log(`Updated Table ${t.tableNumber} (Cafe: ${t.cafeId}) -> ${scanUrl}`);
        }

        console.log('All tables updated successfully.');
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
