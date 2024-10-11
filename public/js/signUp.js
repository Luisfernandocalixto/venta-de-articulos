document.addEventListener('DOMContentLoaded', function () {

    let signUpForm = document.querySelector('#signUpForm');
    let inputName = document.querySelector('#inputName');
    let inputEmail = document.querySelector('#inputEmail');
    let inputPassword = document.querySelector('#inputPassword');
    let inputConfirmPassword = document.querySelector('#inputConfirmPassword');

    signUpForm.addEventListener('submit', function (e) {
        // e.preventDefault();
        if (inputName.value === 0 || inputName.value.trim() === '') return
        if (inputEmail.value === 0 || inputEmail.value.trim() === '') return
        if (inputPassword.value === 0 || inputPassword.value.trim() === '') return
        if (inputConfirmPassword.value === 0 || inputConfirmPassword.value.trim() === '') return

        let direction = '/users/signUp';
        let formData = new FormData(this);

        let signUpButton = document.getElementById('signUpButton')
        fetch(direction, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    document.getElementById('signUpForm').reset();
                    signUpForm.reset()
                }

                signUpForm.reset()
                document.getElementById('signUpForm').reset();
                return response.text();
            })
            .catch(err => console.error('Error'))

    })


})