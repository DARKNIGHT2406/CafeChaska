const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // You might need to install this: npm i bcryptjs jsonwebtoken
const jwt = require('jsonwebtoken');
const Cafe = require('../models/Cafe');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { cafeId, password } = req.body;

        // 1. Find Cafe by Slug or ID (assuming cafeId is used as username for now)
        // In the prompt, it said "Cafe ID = CAFE001". Let's assume 'slug' or a custom 'cafeId' field.
        // My schema has 'slug' and 'id' (uuid). I should probably add a readable 'cafeCode' or just use 'slug'.
        // Prompt: "Cafe ID = CAFE001 to CAFE050". Let's assume this matches 'slug' for simplicity or I should add a field.
        // Let's match against 'slug' for now as the "ID".

        const cafe = await Cafe.findOne({ slug: cafeId });
        if (!cafe) {
            return res.status(400).json({ message: 'Invalid Cafe ID' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, cafe.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Generate JWT
        const payload = {
            cafe: {
                id: cafe.id,
                slug: cafe.slug
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, cafe: { slug: cafe.slug, name: cafe.name } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/auth/register (For seeding/testing)
router.post('/register', async (req, res) => {
    try {
        const { name, slug, password } = req.body;

        let cafe = await Cafe.findOne({ slug });
        if (cafe) {
            return res.status(400).json({ message: 'Cafe already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        cafe = new Cafe({
            name,
            slug,
            password: hashedPassword
        });

        await cafe.save();

        const payload = { cafe: { id: cafe.id, slug: cafe.slug } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
