const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cafeSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    slug: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // Hashed
    theme: { type: String, default: 'japandi' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cafe', cafeSchema);
