document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#btnRecover').addEventListener('click', function () {
        document.querySelector('#receivedAccount').style.display = 'grid'
    })
    document.querySelector('#closeForm').addEventListener('click', function () {
        document.querySelector('#receivedAccount').style.display = 'none'
    })

    let signInForm = document.querySelector('#signInForm');
    let inputEmail = document.querySelector('#inputEmail');
    let inputPassword = document.querySelector('#inputPassword');


    signInForm.addEventListener('submit', function (e) {
        if (inputEmail.value === 0 || inputEmail.value.trim() === '') return
        if (inputPassword.value === 0 || inputPassword.value.trim() === '') return

        let direction = '/users/signIn';
        let formData = new FormData(this);

        fetch(direction, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    signInForm.reset()
                }
                signInForm.reset()
                return response
            })
            .catch(err => console.error('Error'))
    })

})