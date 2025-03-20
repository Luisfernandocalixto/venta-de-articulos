import { checkFormFile } from "/js/functions.js";
document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const button = document.querySelector('button.buttonSend');

    button.disabled = true;
    const textarea = form.querySelector('textarea[name="description"]');
    const inputFile = form.querySelector('input[type="file"]');
    const embed = form.querySelector('embed');

    document.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormFile(textarea, inputFile, button)

    })

    inputFile.addEventListener("change", function (e) {
        const file = this.files[0];
        const reader = new FileReader();

        if (file && file.type === "image/jpeg") {

            reader.onload = function (e) {
                document.querySelector(".showPreview").innerHTML = (`<embed src="${e.target.result}" type="image/jpeg" width="100%" height="200px">`);
            };
            
            reader.readAsDataURL(file);
            
        }
        else if (file && file.type === "image/png") {
            const reader = new FileReader();
            
            reader.onload = function (e) {
                document.querySelector(".showPreview").innerHTML = (`<embed src="${e.target.result}" type="image/png" width="100%" height="200px">`);
            };
            
            reader.readAsDataURL(file);
            
        }
        else if (file && file.type === "image/webp") {
            const reader = new FileReader();
            
            reader.onload = function (e) {
                document.querySelector(".showPreview").innerHTML = (`<embed src="${e.target.result}" type="image/webp" width="100%" height="200px">`);
            };

            reader.readAsDataURL(file);

        }
        else {

            UIkit.notification({ message: 'Debe enviar un file válido.', status: 'warning' });
            button.disabled = true;
        }
    });
})