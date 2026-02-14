const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const categorySchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    cafeId: { type: String, required: true, index: true, ref: 'Cafe' } // Linked to Cafe by slug (or id, but let's stick to slug/customId if we used that)
    // Actually, in seed.js I used 'slug' as the identifier. 
    // Let's verify what 'cafeId' in seed.js refers to.
    // In seed.js: `slug: cafeSlug`.
    // The 'Cafe' model has `id` (uuid) and `slug`.
    // Referencing by `slug` is easier for readable URLs, but `id` is better for foreign keys.
    // Let's stick to `slug` for `cafeId` in these schemas to match the URL structure /:cafe_slug/... 
    // Wait, `ref: 'Cafe'` usually expects an ObjectId. 
    // But my schema says `id: String`.
    // Let's keep it loose: `cafeId` stores the Cafe's `slug` (e.g. CAFE001).
});

module.exports = mongoose.model('Category', categorySchema);
