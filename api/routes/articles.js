const express = require('express');
const router = express.Router();
const Image = require('../models/Image.js')
const { isAuthenticated } = require('../helpers/auth.js');


router.get('/article', isAuthenticated, async (req, res) => {
    try {
        const present = req.user.name;
        const user = req.user._id
        const articles = await Image.find({ user: user }).lean()

        res.render('./components/articulo.hbs', { present, articles })
    } catch (error) {
        res.status(500).json({ message: 'Error server'});
    }
});

router.get('/articles', isAuthenticated, async (req, res) => {
    try {
        const present = req.user.name;
        const articles = await Image.find({}).sort({ createdAt: -1 }).lean();
        
        res.render('./components/articleHome.hbs', { present, articles })
    } catch (error) {
        res.status(500).json({ message: 'Error server'});
    }
});

module.exports = router;