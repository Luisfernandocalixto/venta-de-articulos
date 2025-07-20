const messageByArticle = require("./messageArticle.js");
const messageByForgot = require("./messageForgot.js");
const messageSignup = require("./messageSignup.js");
const messageByUpdatePassword = require("./messageUpdatePassword.js");

/* `const helpers = {};` is declaring an empty object named `helpers`. This object will be used to
store helper functions that are related to renaming text messages for different scenarios in the
code. 
const isDate = new Date('2024-12-12')
const day = isDate.toLocaleString('es-MX', { weekday: 'long', timeZone: 'UTC' })

console.log(day);

*/
const helpers = {};

helpers.renameTextByForgot = text => {
    if (text === messageByForgot.messageErrorUser) return 'No existe un usuario con el email ingresado!'
    if (text === messageByForgot.messageErrorTokenOrExpired) return 'El token no existe o ha expirado!'
    if (text === messageByForgot.messageErrorPassword) return 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.!'


    if (text === messageByForgot.messageSuccessPasswordUpdate) return 'Contraseña actualizada satisfactoriamente!'
    if (text === messageByForgot.messageSuccess) return 'Se ha enviado un link a su email para restablecer su contraseña!'
    if (text === messageSignup.messageSuccess) return 'Cuenta registrada satisfactoriamente!'

    return text
}

helpers.renameTextByUpdatePassword = text => {
    if (text === messageSignup.messagePasswordInvalid) return 'Contraseña  inválida!'
    if (text === messageSignup.messagePasswordEmpty) return 'La contraseña no puede ser vacía!'
    if (text === messageByForgot.messageErrorPassword) return 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.!'
    if (text === messageByUpdatePassword.messageErrorUserNotFound) return 'No existe un usuario con este email!'

    if (text === messageByUpdatePassword.messageSuccess) return 'Contraseña actualizada!'

    return text
}

helpers.renameTextBySignup = text => {
    if (text === messageSignup.messageNameInvalid) return 'Nombre inválido!'
    if (text === messageSignup.messageNameEmpty) return 'El nombre no puede ser vacio!'
    if (text === messageSignup.messageEmailInvalid) return 'Email inválido!'
    if (text === messageSignup.messageEmailEmpty) return 'Email no puede ser vacio!'
    if (text === messageSignup.messagePasswordInvalid) return 'Contraseña  inválida!'
    if (text === messageSignup.messagePasswordEmpty) return 'La contraseña no puede ser vacía!'
    if (text === messageSignup.messageConfirmPasswordInvalid) return 'Confirmación de contraseña inválida!'
    if (text === messageSignup.messageConfirmPasswordEmpty) return 'Confirmación de contraseña vacía!'
    if (text === messageSignup.messageErrorPasswordNotMatch) return 'Las contraseñas no coinciden!'
    if (text === messageSignup.messageErrorPassword) return 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.!'
    if (text === messageSignup.messageErrorUserExist) return 'Ya existe un usuario con este email!'


    if (text === messageSignup.messageSuccess) return 'Cuenta registrada satisfactoriamente!'

    return text
}

helpers.renameTextByArticle = text => {
    if (text === messageByArticle.messageErrorInputs) return 'Necesita completar todos los campos!'

    if (text === messageByArticle.messageSuccess) return 'Articulo publicado!'

    return text
}


helpers.showDateByProfileUser = (date) => {
    const lengthTime = 10;

    const getDate = date.slice(0, lengthTime);
    const isDate = new Date(getDate);

    const month = isDate.toLocaleString('es-MX', { month: 'long' });

    const positionDate = getDate.split('-').reverse();
    const filterDate = positionDate.filter((e, index) => index !== 1);
    const declareDate = `${month} ${filterDate.join(', ')}`; // show date of mode => Octubre 12, 2024
    return declareDate;

}




module.exports = helpers;