const express = require('express');
const router = express.Router();
const { LinksController } = require('../controllers/links.js');

router.get('/', LinksController.index );

module.exports = router;