const keys = {
    "name": "Nombre",
    "lastnamep": "Apellido Paterno",
    "lastname": "Apellido Materno",
    "age": "Edad",
    "phone": "Télefono",
    "email": "Correo Eléctronico",
    "password": "Contraseña",
    "address": "Dirección"
};


$("#registerUser").click(function () {
    const allFormValidate = validateForm();

    if (allFormValidate.validation) {

        const data = {
            name: $("#name").val(),
            lastnamep: $("#lastnamep").val(),
            lastname: $("#lastname").val(),
            age: $("#age").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            address: $("#address").val()
        }

        const validateValue = validateValues(data);
        console.log(validateValue);
        if (validateValue.length > 0) {
            $("#dataInfoIncompleteTitle").text('Información Erronea');
            $("#dataInfoIncomplete").text(`La siguiente información tiene un formato incorrecto: ${validateValue}`);
            $("#modalData").show();
        } else {
            /* Information Complete and Formatt Success */
            sendData(data);
        }
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

function validateValues(data) {

    const regexOnlyLetters = /^[A-Za-záéíóúñÁÉÍÓÚÑ]+$/;
    const regexOnlyNumbers = /^[0-9]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let message = '';

    const regexValidations = {
        name: regexOnlyLetters,
        lastnamep: regexOnlyLetters,
        lastname: regexOnlyLetters,
        age: regexOnlyNumbers,
        phone: regexOnlyNumbers,
        email: regexEmail
    };

    for (let key in data) {
        if (regexValidations[key] && !regexValidations[key].test(data[key])) {
            message += keys[key] + ', ';
        }

    }

    return message.replace(/,\s*$/, '.');

}

function sendData(data) {

    data.id_role = 1;
    const formData = $.param(data);

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/registerUser',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const resp = JSON.parse(response);
            $("#dataInfoIncompleteTitle").text('Registro Éxitoso');
            $("#dataInfoIncomplete").text(`${resp.message}`);
            $("#modalData").show();

        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Registrar al Usuario`);
            $("#modalData").show();

        }
    });

    setTimeout(() => {
        window.location.href = '../index.html';
        sendMessage('Register New User');
    }, 100);

}

function sendMessage(message) {
    socket.send(message);
}
