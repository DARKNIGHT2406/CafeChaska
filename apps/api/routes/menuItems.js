const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu-items/:cafeId?categoryId=...
router.get('/:cafeId', async (req, res) => {
    try {
        const { categoryId } = req.query;
        const query = { cafeId: req.params.cafeId };

        // If categoryId provided, filter by it. Else return all for cafe.
        if (categoryId && categoryId !== 'all') {
            // Find category by internal ID or UUID? Schema uses 'id' (UUID).
            // Let's assume frontend sends the UUID.
            query.categoryId = categoryId;
        }

        const items = await MenuItem.find(query);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/menu-items
router.post('/', async (req, res) => {
    try {
        // Assuming body contains all fields
        const item = new MenuItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/menu-items/:id
router.put('/:id', async (req, res) => {
    try {
        const item = await MenuItem.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
