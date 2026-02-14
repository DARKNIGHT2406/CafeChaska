const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const menuItemSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String, // Primary Image (Backward comp or cover)
    images: [String], // Array of additional image URLs
    videoUrl: String, // MP4 Video URL
    ingredients: [String],
    categoryId: { type: String, required: true, index: true, ref: 'Category' },
    cafeId: { type: String, required: true, index: true, ref: 'Cafe' },
    createdAt: { type: Date, default: Date.now }
});

menuItemSchema.index({ cafeId: 1, categoryId: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
