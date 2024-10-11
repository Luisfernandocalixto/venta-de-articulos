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
    limits: { fileSize: 1024 * 1024 * 5 }
})


router.get('/users/signIn', async (req, res) => {
    try {
        res.render('./components/signIn.hbs')
    } catch (error) {
        console.log('Error', error);
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
        console.log('Error', error);
    }
});

router.post('/users/signUp', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        const errors = [];

        if (name.length <= 0) {
            errors.push({ text: 'Por favor, ingrese su nombre' });
        }
        if (password != confirm_password) {
            errors.push({ text: 'La contraseña no coincide' });
        }

        if (password.length < 4) {
            errors.push({ text: 'La contraseña debe tener una longitud de al menos 4 caracteres minimo' });
        }
        if (!name || !email || !password || !confirm_password) {
            errors.push({ text: 'Por favor, complete los campos solicitados!' });
        }
        if (errors.length > 0) {
            req.flash('error_msg', 'errores');
            res.render('./components/signUp', { errors })
            
        }
        
        else {
            const emailUser = await User.findOne({ email: email });
            if (emailUser) {
                req.flash('error_msg', 'El correo ya existe!');
                errors.push({ text: 'El correo ya existe!' });
                res.redirect('/users/signUp')
            }
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Cuenta registrada')
            res.redirect('/users/signUp');
        }


    } catch (error) {
        console.log('Error', error);
    }
});

router.get('/users/account', isAuthenticated, async (req, res) => {
    try {
        const username = req.user.name;
        const userEmail = req.user.email;

        const present = req.user.name;

        res.render('./components/account', { username, userEmail, present });
    } catch (error) {

    }
});

router.post('/users/update-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = req.user;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'La contraseña actual es incorrecta!')
            res.redirect('/users/account');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        req.flash('success_msg', 'Contraseña actualizada correctamente!')
        res.redirect('/users/account');
    } catch (error) {
        console.log('Error', error);

    }
});


const resend = new Resend(`${process.env.API_KEY_RESEND}`);

router.post('/users/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado')
            return res.redirect('/users/signIn');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [`${user.email}`],
            subject: "Password Reset Request",
            html: `<strong>Please click on the following link to reset your password:</strong>
            http://localhost:8000/users/reset-password/${token}
            `

        })
        if (error) {
            console.log('Error', error);
            return res.status(400).json({ error });

        }
        console.log('Enviado checa el mail');
        req.flash('success_msg', 'Se ha enviado el link de recuperación a su email')
        res.redirect('/users/signIn');



    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: 'Server error', error });

    }

});

router.get('/users/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        res.render('./components/reset-password.hbs', { token });
    } catch (error) {
        console.log('Error', error);

    }

});

router.post('/users/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            req.flash('error_msg', 'Usuario no encontrado')
            return res.redirect('/users/signIn');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        req.flash('success_msg', 'Contraseña actualizada correctamente')
        res.redirect('/users/signIn');




    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token ha expirado' });
        }
        console.log('Error', error);
        res.status(500).json({ message: 'Server error' });

    }

});



router.post('/users/uploadImage', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.file.filename === undefined) {
            res.redirect('/article');

        }
        const imageUrl = req.file.filename;
        const description = req.body.description;


        if (!userId || !imageUrl || !description) {
            req.flash('error_msg', 'Debe completar todos los campos');
            return res.redirect('/article');
            
        }
        
        const newImage = new Image({
            user: userId,
            imageUrl: imageUrl,
            description: req.body.description
        })
        
        await newImage.save();
        req.flash('success_msg', 'Artículo publicado')
        res.redirect('/article');
        
    } catch (error) {
        console.log('Error', error);
        req.flash('error_msg', 'Debe completar todos los campos');
        res.redirect('/article');
    }
});



router.get('/users/logout', isAuthenticated, async (req, res, next) => {
    req.logOut(function (err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
});




module.exports = router;