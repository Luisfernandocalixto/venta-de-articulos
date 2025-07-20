import { checkForm_Account , showPasswords} from '/js/functions.js';

document.addEventListener('DOMContentLoaded', function () {
// variables and elements of DOM => id="signUpForm"
    let signUpForm = document.querySelector('#signUpForm');
    let buttonSignUp = document.querySelector('#signUpButton');
    buttonSignUp.disabled = true;
    let icon = document.querySelector('a.cursor-pointer');
    let inputName = document.querySelector('#inputName');
    let inputEmail = document.querySelector('#inputEmail');
    let inputPassword = document.querySelector('#inputPassword');
    let inputConfirmPassword = document.querySelector('#inputConfirmPassword');

    signUpForm.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm_Account(inputName, inputEmail, inputPassword, inputConfirmPassword, buttonSignUp);

    })

    icon.addEventListener('click', function () {
        showPasswords(inputPassword,inputConfirmPassword, icon);
    });





})