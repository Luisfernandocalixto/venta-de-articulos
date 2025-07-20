const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { UserController } = require('../controllers/users.js');
const { isLoggedIn, isNotLoggedIn } = require('../config/auth.js');


const uploadDir = path.join(__dirname, '../public/uploads');
// create the directory if does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//   create image with name original and date current
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);

    }
})
// image correct accept in server and limit size
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



router.post('/users/forgot-password', UserController.forgotPassword);

router.get('/users/reset-password/:token', UserController.getResetPasswordByToken);

router.post('/users/reset-password/:token', UserController.postResetPasswordByToken);



router.post('/users/uploadImage', isLoggedIn, upload.single('image'), UserController.uploadImage);



router.get('/users/logout', UserController.logout);




module.exports = router;