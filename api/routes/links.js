const express = require('express');
const router = express.Router();
const Image = require('../models/Image.js');
const { LinksController } = require('../controllers/links.js');

router.get('/', LinksController.index );

module.exports = router;