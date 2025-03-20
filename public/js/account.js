import { showPassword, checkFormText, checkInput} from "/js/functions.js";

document.addEventListener('DOMContentLoaded', function () {
    let form = document.querySelector('#updatePassword');
    let buttonSend = document.querySelector('button[type="submit"]');
    buttonSend.disabled = true;

    let inputPassword = form.querySelector('input[name="currentPassword"]');
    let span= form.querySelector('a.cursor-pointer');
    
    
    span.addEventListener('click', function () {        
        showPassword(inputPassword, span);
    });


    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormText(inputPassword, buttonSend);
        checkInput(inputPassword, buttonSend);
    })




});