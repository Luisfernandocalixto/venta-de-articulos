const z = require('zod');
const User = require('./User.js');
const bcrypt = require('bcryptjs');
const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

class UserRepository {
    static async create({ name, email, password, confirm_password }) {
        // 1 validations of username , password  //zod

        const isValidUser = validateSignup({ name, email, password, confirm_password });
        if (!isValidUser.success) {
            const message = JSON.parse(isValidUser.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }
        return name
    }

    static async login({ email, password }) {


        const isValidUser = validateUserLogin({ email });
        if (!isValidUser.success) {
            const message = JSON.parse(isValidUser.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }

        const isValidPassword = validatePasswordLogin({ password });
        if (!isValidPassword.success) {
            const message = JSON.parse(isValidPassword.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }

        const user = await User.findOne({ email: email });
        if (!user) throw new Error("username does not exist!");

        const verifyPassword = await bcrypt.compare(password.trim(), user.password)
        if (!verifyPassword) throw new Error("password is invalid!");

        const publicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        }

        return publicUser
    }



}


const userLogin = z.object({
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' })
})

const passwordLogin = z.object({
    password: z.string({ message: 'Password  invalid!' }).trim().min(1, { message: 'Password empty!' }),

})

function validateUserLogin(input) {
    return userLogin.safeParse(input)
}
function validatePasswordLogin(input) {
    return passwordLogin.safeParse(input)
}

const userSignup = z.object({
    name: z.string('name invalid!').trim().min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    password: z.string({ message: 'Password  invalid!' }).trim({}).min(1, { message: 'Password empty!' }),
    confirm_password: z.string({ message: 'Confirm password  invalid!' }).trim({}).min(1, { message: 'Confirm password empty!' }),

})

function validateSignup(input) {
    return userSignup.safeParse(input)
}

function validatePartialPassword(input) {
    return userSignup.partial().safeParse(input)
}

module.exports = {
    UserRepository,
    validatePartialPassword
};
