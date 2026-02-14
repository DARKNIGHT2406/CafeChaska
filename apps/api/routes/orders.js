const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');

// POST /api/orders - Place a new order (Public)
router.post('/', async (req, res) => {
    try {
        const { cafeId, tableId, items, totalAmount, customerName } = req.body;

        if (!cafeId || !tableId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Missing required order details' });
        }

        // Validate Table exists
        const table = await Table.findOne({ id: tableId, cafeId });
        if (!table) {
            return res.status(404).json({ message: 'Invalid Table' });
        }

        const newOrder = new Order({
            cafeId,
            tableId,
            items,
            totalAmount,
            customerName: customerName || 'Guest',
            status: 'pending'
        });

        await newOrder.save();

        // TODO: Emit Socket.io event here for real-time dashboard update

        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Order Error:', err);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// GET /api/orders/:cafeId - List orders for a cafe (Admin only - Auth required ideally, but keeping simple for now)
router.get('/:cafeId', async (req, res) => {
    try {
        const orders = await Order.find({ cafeId: req.params.cafeId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
