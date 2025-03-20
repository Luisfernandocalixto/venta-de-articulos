import { checkForm, showPassword} from '/js/functions.js';
document.addEventListener('DOMContentLoaded', function () {

    let signInForm = document.querySelector('#signInForm');
    let formAccount = document.querySelector('#receivedAccount');
    let buttonAccount = document.querySelector('.btn-send');
    let inputEmailAccount = document.querySelector('#inputEmail');
    let buttonSignIn = signInForm.querySelector('button[type="submit"]');
    buttonSignIn.disabled = true;
    let inputEmail = document.querySelector('#inputEmail');
    let inputPassword = document.querySelector('#inputPassword'); 
    let span= signInForm.querySelector('a.cursor-pointer');

    // buttonAccount.disabled = true;
    
    span.addEventListener('click', function () {        
        showPassword(inputPassword, span);
    });


    signInForm.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm(inputEmail, inputPassword, buttonSignIn);
    })




});