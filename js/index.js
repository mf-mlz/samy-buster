/* Verify URL */
$(document).ready(function () {
    const url = window.location.href;
    if (url.indexOf('signOut') !== -1) {
        $("#dataInfoIncompleteTitle").text('Sesión Finalizada');
        $("#dataInfoIncomplete").text('');
        $("#modalData").show();
    }

    validateSession();

});


const keys = {
    "email": "Correo Eléctronico",
    "password": "Contraseña"
};

$("#login").click(function () {

    const allFormValidate = validateForm();

    if (allFormValidate.validation) {

        const data = {
            email: $("#email").val(),
            password: $("#password").val()
        }

        sendData(data);

    } else {
        $("#dataInfoIncompleteTitle").text('Información Incompleta');
        $("#dataInfoIncomplete").text(`Por favor, ingresa los datos que faltan: ${allFormValidate.imcompleteKeys}`);
        $("#modalData").show();
    }


});


$(".close, .modal").click(function () {
    $("#modalData").hide();
});


/* Functions */
function validateForm() {
    const inputsForm = document.querySelectorAll('.grid-container input');
    let allFormValidate = true;
    let keyIncomplete = '';

    inputsForm.forEach(function (input) {
        if (input.value.trim() === '') {
            allFormValidate = false;
            keyIncomplete += keys[input.id] + ', ';
        }
    });

    const obj = {
        "validation": allFormValidate,
        "imcompleteKeys": "[ " + keyIncomplete.replace(/,\s*$/, '.') + " ]"
    }
    return obj;
}


function sendData(data) {

    const formData = $.param(data);

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/loginUser',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const user = JSON.parse(response);
            user.created_at_session = new Date();
            localStorage.setItem('userData', JSON.stringify(user));
            window.location.href = 'pages/dashboard.html';

        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            $("#dataInfoIncompleteTitle").text(`Inicio de Sesión Fallido`);
            $("#dataInfoIncomplete").text(err.message);
            $("#modalData").show();

        }
    });
}


function validateSession() {
    const objetoRecuperado = JSON.parse(localStorage.getItem('userData'));
    if (objetoRecuperado) {
        window.location.href = 'pages/dashboard.html';
    }
}