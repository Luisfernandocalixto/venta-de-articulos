const { ITEMS_PER_PAGE } = require("../constants/links.js");
const Image = require("../models/Image");
class LinksController {

    static async index(req, res) {
        try {
            // show latest articles
            const getArticles = await Image.find({},{__v:0}).sort({ createdAt: -1 }).limit(ITEMS_PER_PAGE);
            const articles = getArticles.map(a => {
                return {
                    id: a._id,
                    user: a.user,
                    imageUrl: a.imageUrl,
                    description: a.description,
                    // createdAt: new Date(a.createdAt).toLocaleString('es-MX',{ })
                    createdAt: new Date(a.createdAt).toLocaleString('es-MX',{ day:'2-digit', weekday: 'short', month: 'short', year: 'numeric'})
                }
            });

            res.render('./components/home.hbs', { articles })
        } catch (error) {            
            res.status(500).json("Error show page principal");
        }
    }
}

module.exports = {

    LinksController
};
