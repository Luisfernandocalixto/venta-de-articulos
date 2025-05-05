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
const { EMAIL, NAME, BREVO_API_KEY, URL, JWT_SECRET } = require('../config/config.js');
const { UserController } = require('../controllers/users.js');
const { isLoggedIn, isNotLoggedIn } = require('../config/auth.js');

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


router.get('/users/signIn', isNotLoggedIn, UserController.getSignIn);

router.post('/users/signIn', UserController.SignIn);

router.get('/users/signUp', isNotLoggedIn, UserController.getSignup);

router.post('/users/signUp', UserController.Signup);

router.get('/users/account', isLoggedIn, UserController.Account);

router.post('/users/update-password', isLoggedIn, UserController.UpdatePassword);


// const resend = new Resend(`${process.env.API_KEY_RESEND}`);

router.post('/users/forgot-password', UserController.forgotPassword);

router.get('/users/reset-password/:token', UserController.getResetPasswordByToken);

router.post('/users/reset-password/:token', UserController.postResetPasswordByToken);



router.post('/users/uploadImage', isLoggedIn, upload.single('image'), UserController.uploadImage);



router.get('/users/logout', UserController.logout);




module.exports = router;