const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const QRCode = require('qrcode');

// GET /api/tables/:cafeId - List all tables for a cafe
router.get('/:cafeId', async (req, res) => {
    try {
        const tables = await Table.find({ cafeId: req.params.cafeId }).sort({ tableNumber: 1 });
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tables/:cafeId - Create a new table & Generate QR
router.post('/:cafeId', async (req, res) => {
    try {
        const { tableNumber } = req.body;
        const { cafeId } = req.params;

        // Check if table exists
        const existing = await Table.findOne({ cafeId, tableNumber });
        if (existing) {
            return res.status(400).json({ message: 'Table number already exists' });
        }

        const newTable = new Table({
            tableNumber,
            cafeId
        });

        // Generate QR Code
        // URL format: https://my-app.ngrok.io/scan/:cafeId/:tableId
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        console.log('Generating QR with Base URL:', frontendUrl);

        const scanUrl = `${frontendUrl}/scan/${cafeId}/${newTable.id}`;

        // Generate Base64 QR
        const qrCodeData = await QRCode.toDataURL(scanUrl);

        newTable.qrCodeData = qrCodeData;
        await newTable.save();

        res.status(201).json(newTable);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create table' });
    }
});

// DELETE /api/tables/:id - Remove a table
router.delete('/:id', async (req, res) => {
    try {
        await Table.deleteOne({ id: req.params.id });
        res.json({ message: 'Table deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
