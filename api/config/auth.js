module.exports = {
    isLoggedIn(req, res, next) {
        try {
            const user = req.session
            if (user.user) {
                return next();
            }
            return res.redirect('/users/signIn');
        } catch (error) {
            return res.redirect('/users/signIn');

        }
    },

    isNotLoggedIn(req, res, next) {
        try {
            const user = req.session
            if (!user.user) {
                return next();
            }
            return res.redirect('/article');
        } catch (error) {
            return res.redirect('/users/signIn');

        }
    }
}