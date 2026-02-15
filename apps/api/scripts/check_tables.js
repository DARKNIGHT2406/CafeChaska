const mongoose = require('mongoose');
const Table = require('../models/Table');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe_chaska';

const fs = require('fs');
const path = require('path');
const debugFile = path.join(__dirname, 'tables_debug.txt');

// Clear file
fs.writeFileSync(debugFile, '');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(debugFile, msg + '\n');
};

mongoose.connect(MONGO_URI)
    .then(async () => {
        log('Connected to DB');
        try {
            const tables = await Table.find({});
            log(`Found ${tables.length} tables.`);
            tables.forEach(t => {
                log(`Table ${t.tableNumber} (Cafe: ${t.cafeId})`);
                if (t.qrCodeData) {
                    log(` - QR Data Length: ${t.qrCodeData.length}`);
                    log(` - Preview: ${t.qrCodeData.substring(0, 50)}...`);
                } else {
                    log(' - QR Data: MISSING');
                }
            });
        } catch (e) {
            log('Error: ' + e.message);
        }
        mongoose.connection.close();
    })
    .catch(err => log('Connection Error: ' + err));
