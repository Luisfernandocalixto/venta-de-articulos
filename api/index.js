require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, PORT, PORT_SECOND } = require('./config/config.js');


// server
const app = express();
require('../api/database/database.js');
app.disable('x-powered-by');
app.use(cookieParser());

// config port and views handlebars
app.set('port', process.env.PORT || PORT_SECOND);

app.set('views', path.join(__dirname, '../client/views/'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers : require('../api/helpers/helpers.js')
}));

app.set('view engine', '.hbs');

// config of token
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

// no accept cache in browser , confide data 
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// routes
app.use(require('../api/routes/links.js'));
app.use(require('../api/routes/users.js'));
app.use(require('../api/routes/articles.js'));

// static files 
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '/public')));

// page 404
app.use((req, res) => {
    res.render('./components/404.hbs');
})

// server
app.listen(app.get('port'), () => {
    console.log(`Server listening on http://localhost:${app.get('port')}`)
})

module.exports = app;