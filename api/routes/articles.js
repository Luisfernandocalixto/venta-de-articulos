const Image = require('../models/Image.js')
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth.js');
const { isLoggedIn } = require('../config/auth.js');
const { ArticleController } = require('../controllers/articles.js');

router.get('/article', isLoggedIn, ArticleController.article);

router.get('/articles', isLoggedIn, ArticleController.articles);

module.exports = router;