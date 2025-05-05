import { checkForm, showPassword } from '/js/functions.js';
document.addEventListener('DOMContentLoaded', function () {

    let signInForm = document.querySelector('#signInForm');
    let buttonAccount = document.querySelector('.btn-send');
    let buttonSignIn = signInForm.querySelector('button[type="submit"]');
    buttonSignIn.disabled = true;
    let inputEmail = document.querySelector('#inputEmail');
    let inputPassword = document.querySelector('#inputPassword');
    let span = signInForm.querySelector('a.cursor-pointer');

    // buttonAccount.disabled = true;

    span.addEventListener('click', function () {
        showPassword(inputPassword, span);
    });


    signInForm.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm(inputEmail, inputPassword, buttonSignIn);
    })


    signInForm?.addEventListener('submit', e => {
        e.preventDefault()

        buttonAccount.disabled = true;
        fetch('/users/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: inputEmail.value.trim(), password: inputPassword.value.trim() })
        })
            .then(res => {
                if (res.ok) {
                    window.location.href = '/article'
                } else {
                    return res.text();
                }
            })
            .then(data => {
                if (!data) {

                }
                else {
                    UIkit.notification({message: `${data}`, status: 'danger'})

                }

            })
            .finally(() => {
                buttonAccount.disabled = false
                signInForm.reset();
            })


    })




});