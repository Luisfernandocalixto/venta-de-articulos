const Image = require("../models/Image");

class LinksController {

    static async index(req, res) {
        try {
            const articles = await Image.find({}).sort({ createdAt: -1 }).lean();

            res.render('./components/home.hbs', { articles })
        } catch (error) {
            res.status(500).json({ message: 'Error server' });
        }
    }
}

module.exports = {

    LinksController
};
