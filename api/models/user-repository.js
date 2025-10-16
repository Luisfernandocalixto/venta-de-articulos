const z = require('zod');
const User = require('./User.js');
const bcrypt = require('bcryptjs');
const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

class UserRepository {
    static async create({ name, email, password, confirm_password }) {
        // 1 validations of username , password  //zod

        const isValidUser = validatePartialDataOfUser({ name, email, password, confirm_password });
        if (!isValidUser.success) {
            const message = JSON.parse(isValidUser.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }
        return name
    }

    static async login({ email, password }) {


        const isValidUser = validatePartialDataOfUser({ email, password });
        if (!isValidUser.success) {
            const message = JSON.parse(isValidUser.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }

        const user = await User.findOne({ email: email });
        if (!user) throw new Error("username does not exist!");

        const verifyPassword = await bcrypt.compare(password.trim(), user.password)
        if (!verifyPassword) throw new Error("password is incorrect!");

        const publicUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            date: user.date
        }

        return publicUser
    }



}


const user = z.object({
    id: z.union([z.string({ message: 'id invalid!' }).trim().min(1, { message: 'id empty!' }), z.number({ message: 'id invalid!' }).min(1, { message: 'id empty' })]),
    name: z.string('name invalid!').trim().min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    password: z.string({ message: 'Password  invalid!' }).trim({}).min(1, { message: 'Password empty!' }),
    confirm_password: z.string({ message: 'Confirm password  invalid!' }).trim({}).min(1, { message: 'Confirm password empty!' }),
    token: z.string({ message: 'Token  invalid!' }).trim({}).min(1, { message: 'Token empty!' }),

})

function validatePartialDataOfUser(input) {
    return user.partial().safeParse(input)
}

module.exports = {
    UserRepository,
    validatePartialDataOfUser
};
