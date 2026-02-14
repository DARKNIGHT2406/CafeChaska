const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Debug logs
console.log('--- Upload Route Init ---');

// Check if credentials exist and are NOT empty strings
const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME.trim() !== '' &&
    process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY.trim() !== '' &&
    process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET.trim() !== '';

let upload;

if (isCloudinaryConfigured) {
    console.log('Configuring Cloudinary Storage');
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'cafe_chaska_menu',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
            resource_type: 'auto'
        },
    });
    upload = multer({ storage: storage });
} else {
    console.log('Configuring Local Disk Storage (Fallback)');

    // Ensure uploads dir exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
            // Unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    })
    upload = multer({ storage: storage });
}

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
    console.log('Upload Request Received');

    if (!req.file) {
        console.error('No file in request');
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (isCloudinaryConfigured) {
        console.log('File uploaded to Cloudinary:', req.file.path);
        return res.json({ url: req.file.path });
    } else {
        // Local file URL
        const localUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        console.log('File uploaded locally:', localUrl);
        return res.json({ url: localUrl });
    }
});

module.exports = router;
