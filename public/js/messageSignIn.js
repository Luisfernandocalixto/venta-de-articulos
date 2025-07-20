export function showMessage(data) {
    const typeMessage = {
        emailInvalid: 'email invalid!',
        emailEmpty: 'email empty!',
        passwordInvalid: 'password  invalid!',
        passwordEmpty: 'password empty!',
        userExist: 'username does not exist!',
        passwordIncorrect: 'password is incorrect!',

    }

    if (data.includes(typeMessage.emailInvalid)) return 'Ingrese un email válido!'
    if (data.includes(typeMessage.emailEmpty)) return 'El email no puede ser vacio!'
    if (data.includes(typeMessage.passwordInvalid)) return 'Contraseña inválida!'
    if (data.includes(typeMessage.passwordEmpty)) return 'La contraseña no puede ser vacía!'
    if (data.includes(typeMessage.userExist)) return 'El usuario no existe!'
    if (data.includes(typeMessage.passwordIncorrect)) return 'La contraseña es incorrecta!'
    return 'Error al iniciar sesión!'
}