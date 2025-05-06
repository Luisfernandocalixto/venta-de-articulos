const Image = require("../models/Image");
const User = require("../models/User");
const { UserRepository, validatePartialPassword } = require("../models/user-repository");
const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, EMAIL, NAME, URL, BREVO_API_KEY } = require("../config/config");
const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

class UserController {
    static async getSignIn(req, res) {
        try {
            res.render('./components/signIn.hbs');
        } catch (error) {
            res.status(500).json({ message: 'Error server' });
        }
    }

    static async SignIn(req, res) {
        try {
            const { email, password } = req.body

            const user = await UserRepository.login({ email, password })
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' })


            res.cookie('access_token', token, {
                httpOnly: true, // la cookie solo se puede acceder en el  servidor
                secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
                sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
                maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
            }).send({ user, token })
        } catch (error) {

            if (error.message.includes('email')) return res.status(401).json(error.message)
            if (error.message.includes('password')) return res.status(401).json(error.message)
            if (error.message.includes('username')) return res.status(401).json(error.message)
            return res.status(401).json('Error server');
        }
    }

    static async getSignup(req, res) {
        try {
            res.render('./components/signUp.hbs')
        } catch (error) {
            res.status(500).json({ message: 'Error server' });
        }
    }

    static async Signup(req, res) {
        try {

            const { name, email, password, confirm_password } = req.body;
            const user = await UserRepository.create({ name, email, password, confirm_password })


            if (password !== confirm_password) {
                return res.render('components/signUp', { error_msg: 'Password no match!' });
            }


            if (!regex.test(password.trim()) || !regex.test(confirm_password.trim())) {
                return res.render('components/signUp', { error_msg: 'Password should have length of 8 character minimum, should have letters, numbers and symbol!' });
            }


            else {
                const emailUser = await User.findOne({ email: email });
                if (emailUser) {
                    return res.render('components/signUp', { error_msg: 'email already exists!' });
                }
                else {
                    const newUser = new User({ name, email, password });
                    newUser.password = await newUser.encryptPassword(password.trim());
                    await newUser.save();
                    return res.render('components/signIn', { success_msg: 'account register successfully!' });
                }
            }


        } catch (error) {
            if (error.message.includes('name')) return res.render('components/signUp', { error_msg: error.message });
            if (error.message.includes('email')) return res.render('components/signUp', { error_msg: error.message });
            if (error.message.includes('password')) return res.render('components/signUp', { error_msg: error.message });
            if (error.message.includes('confirm_password')) return res.render('components/signUp', { error_msg: error.message });
            return res.status(500).json({ message: 'Server error' });

        }
    }

    static async Account(req, res) {
        try {
            const currentSession = req.session;
            const { name, email } = currentSession.user;
            const username = name;
            const userEmail = email;

            const present = name;

            res.render('./components/account', { username, userEmail, present });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });

        }
    }


    static async UpdatePassword(req, res) {
        try {
            const { currentPassword } = req.body;
            const currentSession = req.session
            const { id } = currentSession.user

            const { name, email } = currentSession.user;
            const username = name;
            const userEmail = email;

            const present = name;


            const verify = validatePartialPassword({ currentPassword });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.render('components/account.hbs', { error_msg: errors, username, userEmail, present })
            }

            if (!regex.test(currentPassword.trim())) {
                return res.render('components/account', { error_msg: 'Password should have length of 8 character minimum, should have letters, numbers and symbol', username, userEmail, present });
            }

            const isMatch = await User.findById(id);
            if (!isMatch) {
                return res.render('components/account', { error_msg: 'User no found!', username, userEmail, present });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(currentPassword.trim(), salt);
            isMatch.password = hashedPassword;
            await isMatch.save();
            return res.render('components/account', { success_msg: 'Password update successfully!', username, userEmail, present });
        } catch (error) {
            res.status(500).json({ message: 'Error server' })

        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('./components/signIn', { error_msg: 'user no found!' })
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
                return res.render('./components/signIn', { success_msg: 'send link your email for reset password!' })

            }
        } catch (error) {

            res.status(500).json({ message: 'Server error', error });

        }

    }

    static async getResetPasswordByToken(req, res) {
        try {
            const { token } = req.params;
            if (!token) {
                return res.render('./components/signIn', { error_msg: 'Token no found or expired' });
            }
            else {
                return res.status(200).render('./components/reset-password.hbs', { token });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async postResetPasswordByToken(req, res) {
        try {
            const { password } = req.body;
            const { token } = req.params;

            if (!token) {
                return res.render('./components/signIn', { error_msg: 'Token no found or expired' });
            }
            if (!regex.test(password.trim())) {
                return res.render('./components/signIn', { error_msg: 'Password should have length of 8 character minimum, should have letters, numbers and symbol' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId;

            const user = await User.findById(userId);
            if (!user) {
                return res.render('./components/signIn', { error_msg: 'user no found!' })
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password.trim(), salt);

                user.password = hashedPassword;
                await user.save();

                return res.render('./components/signIn', { success_msg: 'password update successfully!' })
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'Token expired!' });
            }
            res.status(500).json({ message: 'Server error' });

        }

    }

    static async logout(req, res) {
        try {
            res.clearCookie('access_token').redirect('/users/signIn');
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }


    static async uploadImage(req, res) {
        try {

            const currentSession = req.session;
            const { id, name } = currentSession.user
            const userId = id;
            const present = name;
            const articles = await Image.find({ user: id }).lean()


            if (req.file.filename === undefined) {
                return res.render('./components/articulo', { error_msg: 'Required inputs', articles, present });
            }
            const imageUrl = req.file.filename;
            const description = req.body.description;


            if (!userId || !imageUrl || !description) {
                return res.render('./components/articulo', { error_msg: 'Required inputs', present, articles })
            }
            else {

                const newImage = new Image({
                    user: userId,
                    imageUrl: imageUrl,
                    description: req.body.description
                })

                await newImage.save();
                return res.render('./components/articulo', { success_msg: 'Article public', present, articles })
            }

        } catch (error) {
            res.status(500).json('Error server')
        }
    }

}

module.exports = {
    UserController
};
