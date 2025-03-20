const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Image = require('../models/Image.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const { isAuthenticated } = require('../helpers/auth.js');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const SibApiV3Sdk = require('@sendinblue/client');
const { EMAIL, NAME, BREVO_API_KEY, URL, JWT_SECRET } = require('../config/config.js')

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);

    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        else {
            req.flash('error_msg', 'Archivo invalido!')
            cb(null, false);
        }

    }
})


router.get('/users/signIn', async (req, res) => {
    try {
        res.render('./components/signIn.hbs')
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
});

router.post('/users/signIn', passport.authenticate('local', {
    successRedirect: '/article',
    failureRedirect: '/users/signIn',
    failureFlash: true
}));

router.get('/users/signUp', async (req, res) => {
    try {
        res.render('./components/signUp.hbs')
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
});

router.post('/users/signUp', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        if (!name || !email || !password || !confirm_password || name.trim() === "" || email.trim() === "" || password.trim() === "" || confirm_password.trim() === "") {
            req.flash('error_msg', 'Por favor, complete los campos solicitados!');
            res.redirect('/users/signUp');
            return;
        }

        if (password != confirm_password) {

            req.flash('error_msg', 'La contraseña no coincide!');
            res.redirect('/users/signUp');
            return;
        }

        if (password.length < 8 || confirm_password.length < 8) {

            req.flash('error_msg', 'La contraseña debe tener una longitud de al menos 8 caracteres minimo');
            res.redirect('/users/signUp');
            return;
        }
        if (!regex.test(password.trim()) || !regex.test(confirm_password.trim())) {

            req.flash('error_msg', 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.');
            res.redirect('/users/signUp');
            return;

        }

        else {
            const emailUser = await User.findOne({ email: email });
            if (emailUser) {
                req.flash('error_msg', 'El correo ya existe!');
                res.redirect('/users/signUp');
                return;
            }
            else {
                const newUser = new User({ name, email, password });
                newUser.password = await newUser.encryptPassword(password.trim());
                await newUser.save();
                req.flash('success_msg', 'Cuenta registrada!')
                res.redirect('/users/signIn');
                return;
            }
        }


    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/users/account', isAuthenticated, async (req, res) => {
    try {
        const username = req.user.name;
        const userEmail = req.user.email;

        const present = req.user.name;

        res.render('./components/account', { username, userEmail, present });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });

    }
});

router.post('/users/update-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword } = req.body;

        if (!currentPassword || currentPassword.trim() === '') {
            req.flash('error_msg', 'Debe agregar una contraseña!')
            res.redirect('/users/account');
            return;
        }
        if (!regex.test(currentPassword.trim())) {
            req.flash('error_msg', 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.!')
            res.redirect('/users/account');
            return;
        }

        const user = req.user;
        const isMatch = await User.findById(req.user.id);
        if (!isMatch) {
            req.flash('error_msg', 'El usuario no existe!')
            res.redirect('/users/account');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(currentPassword.trim(), salt);
        user.password = hashedPassword;
        await user.save();
        req.flash('success_msg', 'Contraseña actualizada correctamente!')
        res.redirect('/users/account');
    } catch (error) {
        res.status(500).json({ message: 'Error server' })

    }
});


// const resend = new Resend(`${process.env.API_KEY_RESEND}`);

router.post('/users/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado')
            return res.redirect('/users/signIn');
        }
        else {

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            // config with resend API
            // const { data, error } = await resend.emails.send({
            //     from: "Acme <onboarding@resend.dev>",
            //     to: [`${user.email}`],
            //     subject: "Password Reset Request",
            //     html: `<strong>Please click on the following link to reset your password:</strong>
            //     ${URL}/users/reset-password/${token}
            //     `

            // })
            // if (error) {
            //     console.log('Error', error);
            //     return res.status(400).json({ error });
            // }
            const sendSmtpEmail = {
                to: [{ email: email, name: email }],
                sender: { email: EMAIL, name: NAME },
                subject: 'Recuperación de cuenta',
                htmlContent: `<strong>Hola, aquí tienes la información solicitada:</strong>
            <a href="${URL}/users/reset-password/${token}">Restablecer contraseña</a>
            `
            };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(
                function (data) {
                    console.log('Correo enviado exitosamente. Respuesta:');
                },
                function (error) {
                    console.error('Error al enviar el correo:');
                }
            );
            req.flash('success_msg', 'Se ha enviado el link de recuperación a su email')
            res.redirect('/users/signIn');
            return;

        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });

    }

});

router.get('/users/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            req.flash('error_msg', 'Token no encontrado o expirado, intente nuevamente');
            res.redirect('/users/signIn');
            return;
        }
        else {
            res.status(200).render('./components/reset-password.hbs', { token });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/users/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (!token) {
            req.flash('error_msg', 'Token no encontrado o expirado, intente nuevamente');
            res.redirect('/users/signIn');
            return;
        }
        if (!regex.test(password.trim())) {
            res.status(400).json({ message: 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado')
            return res.redirect('/users/signIn');
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password.trim(), salt);

            user.password = hashedPassword;
            await user.save();

            req.flash('success_msg', 'Contraseña actualizada correctamente')
            res.redirect('/users/signIn');
            return;
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token ha expirado' });
        }
        res.status(500).json({ message: 'Server error' });

    }

});



router.post('/users/uploadImage', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.file.filename === undefined) {
            req.flash('error_msg', 'Debe completar todos los campos');
            res.redirect('/article');
            return;
        }
        const imageUrl = req.file.filename;
        const description = req.body.description;


        if (!userId || !imageUrl || !description) {
            req.flash('error_msg', 'Debe completar todos los campos');
            return res.redirect('/article');

        }
        else {

            const newImage = new Image({
                user: userId,
                imageUrl: imageUrl,
                description: req.body.description
            })

            await newImage.save();
            req.flash('success_msg', 'Artículo publicado')
            res.redirect('/article');
            return;
        }

    } catch (error) {
        res.redirect('/article');
    }
});



router.get('/users/logout', async (req, res, next) => {
    try {
        req.logOut(function (err) {
            if (err) { return next(err) }
            res.redirect('/')
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;