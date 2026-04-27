const { ITEMS_PER_PAGE } = require('../constants/articles.js');
const Image = require('../models/Image.js');
const { showDate } = require('../utils/utils.js');


class ArticleController {

    static async article(req, res) {
        try {
            const currentSession = req.session;
            const { id, name } = currentSession.user;
            
            const { success_msg, error_msg } = req.query;

            const countArticles = await Image.find({ user: id }).countDocuments();

            res.render('./components/article.hbs', { present: name, countArticles, id , success_msg, error_msg})
        } catch (error) {
            
            res.status(500).json("Error show article");
        }
    }

    static async deleteArticle(req, res) {
        try {

            await Image.findByIdAndDelete({ _id: req.params.id });

            res.status(200).json('Article delete successfully!');
        } catch (error) {
            res.status(500).json("Error delete article");
        }
    }

    static async articles(req, res) {
        try {
            const currentSession = req.session;
            const { name } = currentSession.user;
            res.render('./components/articleHome.hbs', { present: name });
        } catch (error) {
            res.status(500).json("Error show page principal");
        }
    }
    static async shopArticles(req, res) {
        try {
            let {page} = req.query;
            if(!page) page = 1;
            // Is important offset for pagination
            const offset = (page - 1) * ITEMS_PER_PAGE;

            const getArticles = await Image.find({},{__v: 0})
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(ITEMS_PER_PAGE);
            
            const articles = getArticles.map(a => {
                return {
                    id: a._id,
                    user: a.user,
                    imageUrl: a.imageUrl,
                    description: a.description,
                    createdAt: showDate({date :a.createdAt})
                    // createdAt: new Date(a.createdAt).toLocaleString('es-MX',{ day:'2-digit', weekday: 'short', month: 'short', year: 'numeric'})
                }
            });

            const  queryPages = await Image.find().countDocuments();
            const totalPages = Math.ceil(Number(queryPages) / ITEMS_PER_PAGE);
            
            
         res.status(200).json({articles, totalPages});
        } catch (error) {
            res.status(500).json("Error show articles");
        }
    }
    static async shopArticlesByUser(req, res) {
        try {
            const {id} = req.params;

            let {page} = req.query;
            if(!page) page = 1;
            // Is important offset for pagination
            const offset = (page - 1) * ITEMS_PER_PAGE;

            const getArticles = await Image.find({ user: id },{__v: 0})
            .skip(offset)
            .lean()
            .limit(ITEMS_PER_PAGE);
            
            const articles = getArticles.map(a => {
                return {
                    id: a._id,
                    user: a.user,
                    imageUrl: a.imageUrl,
                    description: a.description,
                    createdAt: showDate({ date: a.createdAt})
                    // createdAt: new Date(a.createdAt).toLocaleString('es-MX',{ day:'2-digit', weekday: 'short', month: 'short', year: 'numeric'})
                }
            });

            const  queryPages = await Image.find({ user: id }).countDocuments();
            const totalPages = Math.ceil(Number(queryPages) / ITEMS_PER_PAGE);
            
            
         res.status(200).json({articles, totalPages});
        } catch (error) {
            res.status(500).json("Error show articles");
        }
    }
}

module.exports = {
    ArticleController
};
