require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');


// server
const app = express();
require('../api/database/database.js');
require('../api/config/passport.js');


app.set('port', process.env.PORT);

app.set('views', path.join(__dirname, '../client/views/'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.disable('x-powered-by');

app.use(session({
    secret: 'mysecretapp',
    resave: false,
    saveUninitialized: false,
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})



app.use(require('../api/routes/links.js'));
app.use(require('../api/routes/users.js'));
app.use(require('../api/routes/articles.js'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '/public')));

app.listen(app.get('port'), () => {
    console.log(`Server listening on http://localhost:${app.get('port')}`)
})

module.exports = app;