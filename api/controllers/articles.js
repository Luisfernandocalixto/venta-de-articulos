const Image = require('../models/Image.js')


class ArticleController {

    static async article(req, res) {
        try {
            const currentSession = req.session;
            const { id, name } = currentSession.user;

            const { success_msg, error_msg } = req.query;

            const present = name;
            const user = id
            const articles = await Image.find({ user: user }).lean()

            res.render('./components/article.hbs', { present, articles , success_msg, error_msg})
        } catch (error) {

            res.status(500).json({ message: 'Error server' });
        }
    }

    static async articles(req, res) {
        try {
            const currentSession = req.session;
            const { name } = currentSession.user;
            const present = name;
            const articles = await Image.find({}).sort({ createdAt: -1 }).lean();

            res.render('./components/articleHome.hbs', { present, articles })
        } catch (error) {
            res.status(500).json({ message: 'Error server' });
        }
    }
}

module.exports = {
    ArticleController
};
