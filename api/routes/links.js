const express = require('express');
const router = express.Router();
const Image = require('../models/Image.js');

router.get('/', async (req, res) => {
    try {
        const articles = await Image.find({}).sort({ createdAt: -1 }).lean();

        res.render('./components/home.hbs', { articles })
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
});

module.exports = router;