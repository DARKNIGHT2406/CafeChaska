const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tableSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    tableNumber: { type: String, required: true }, // e.g., "1", "Window-1"
    cafeId: { type: String, required: true, index: true, ref: 'Cafe' },
    qrCodeData: { type: String }, // Base64 or URL of the QR code
    createdAt: { type: Date, default: Date.now }
});

// Ensure table numbers are unique per cafe
tableSchema.index({ cafeId: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
