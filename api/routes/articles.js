const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../config/auth.js');
const { ArticleController } = require('../controllers/articles.js');


router.get('/article', isLoggedIn, ArticleController.article);

router.get('/articles', isLoggedIn, ArticleController.articles);

router.get('/shop', isLoggedIn, ArticleController.shopArticles);

router.get('/shop/:id', isLoggedIn, ArticleController.shopArticlesByUser);

module.exports = router;