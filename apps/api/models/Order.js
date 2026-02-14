const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    variant: String
});

const orderSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    cafeId: { type: String, required: true, index: true, ref: 'Cafe' },
    tableId: { type: String, required: true, index: true, ref: 'Table' },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending'
    },
    customerName: String, // Optional
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
