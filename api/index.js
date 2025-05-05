require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/config.js');


// server
const app = express();
require('../api/database/database.js');
app.disable('x-powered-by');
app.use(cookieParser());


app.set('port', process.env.PORT);

app.set('views', path.join(__dirname, '../client/views/'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.session.user = data
    } catch (error) {
    }
    next();
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json());


app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});


app.use(require('../api/routes/links.js'));
app.use(require('../api/routes/users.js'));
app.use(require('../api/routes/articles.js'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res) => {
    res.render('./components/404.hbs');
})


app.listen(app.get('port'), () => {
    console.log(`Server listening on http://localhost:${app.get('port')}`)
})

module.exports = app;