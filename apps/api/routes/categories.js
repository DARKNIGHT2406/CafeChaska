const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories/:cafeId
router.get('/:cafeId', async (req, res) => {
    try {
        const categories = await Category.find({ cafeId: req.params.cafeId });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/categories
router.post('/', async (req, res) => {
    try {
        const { name, cafeId } = req.body;
        const category = new Category({ name, cafeId });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findOneAndUpdate(
            { id: req.params.id },
            { name },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
