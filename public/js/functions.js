const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export function showPassword(input, span) {

    if (input.type === 'password') {
        input.type = 'text';
        span.setAttribute('uk-icon', 'icon: eye');
    }
    else {
        input.type = 'password';
        span.setAttribute('uk-icon', 'icon: lock');
    }

}
export function showPasswords(input, inputSecond, span) {

    if (input.type === 'password') {
        input.type = 'text';
        inputSecond.type = 'text';
        span.setAttribute('uk-icon', 'icon: eye');
    }
    else {
        input.type = 'password';
        inputSecond.type = 'password';
        span.setAttribute('uk-icon', 'icon: lock');

    }
}



export function checkForm(input, inputSecond, button) {
    if (input.value.trim() === "" || inputSecond.value.trim() === "") {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }

}

export function checkFormFile(input, inputSecond, button) {
    const limitImage = 5242880;
    
    if (input.value.trim() === "" || inputSecond.value.trim() === "") {
        button.disabled = true;
    }
    else if (inputSecond.files[0].size > limitImage) {
        UIkit.notification({ message: 'La imagen excede de los 5MB.', status: 'warning' });
        button.disabled = true;
    }
    else if (inputSecond.type !== 'file' ) {
        button.disabled = true;
        UIkit.notification({ message: 'Debe enviar un file válido.', status: 'warning' });
    }
    else {
        button.disabled = false;
    }

}

export function checkFormText(input, button) {
    if (input.value.trim() === "") {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }

}

export function checkInput(input, button) {
    if (input.value.trim() === "") {
        button.disabled = true;
    }
    else if (!regex.test(input.value.trim())) {
        UIkit.notification({ message: 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.', status: 'warning' });
        button.disabled = true;

    }
    else {
        button.disabled = false;
    }

}

export function checkForm_Account(input, input2, input3, input4, button) {

    if (input.value.trim() === "" || input2.value.trim() === "" || input3.value.trim() === "" || input4.value.trim() === "") {
        button.disabled = true;
    }
    else if (!regex.test(input3.value.trim() || !regex.test(input4.value.trim()))) {
        button.disabled = true;
        UIkit.notification({ message: 'La contraseña debe tener una longitud de 8 caracteres minimo, además debe contener letras, números y al menos un símbolo.', status: 'warning' });

    }
    else if (input3.value.trim() !== input4.value.trim()) {
        button.disabled = true;
        UIkit.notification({ message: 'La contraseña no coincide.', status: 'warning' });

    }
    else {
        button.disabled = false;
    }
}
