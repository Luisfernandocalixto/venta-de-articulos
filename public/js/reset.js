import { showPassword, checkInput } from '/js/functions.js';
document.addEventListener('DOMContentLoaded', function () {
// variables and elements of DOM => class="formReset"
    const formReset = document.querySelector('.formReset');
    const buttonReset = formReset.querySelector('button[type="submit"]');
    const inputPassword = formReset.querySelector('input');
    const anchor = formReset.querySelector('a.cursor-pointer');
    
    anchor.addEventListener('click', function () {
        showPassword(inputPassword, anchor);
    });

    inputPassword.addEventListener('change', function () {
        checkInput(inputPassword, buttonReset);
    })

});