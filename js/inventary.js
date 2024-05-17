$(document).ready(function () {
    validateSession();
    // socket.send("Hola desde inventary.js");
});

function validateSession() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    const data = {
        id: userLogged.id
    };
    if (!userLogged) {
        window.location.href = '../index.html?signOut';
    } else {
        const obj = {};
        getBuys(obj);
    }
}

function getBuys(obj) {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    const data = {
        id: userLogged.id
    };
    const formData = $.param(data);
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getBuys',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const resp = JSON.parse(response);
            getMovies(resp, obj);
        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            $("#dataInfoIncompleteTitle").text(`Error Al Obtener las Compras`);
            $("#dataInfoIncomplete").text(err.message);
            $("#dataActions").empty();
            $("#modalData").show();

        }
    });
}


function getMovies(buys, obj) {
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getMovies',
        type: 'GET',
        data: obj,
        success: function (response) {
            const movies = JSON.parse(response);
            createInventary(movies, buys);
        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Obtener el Inventario`);
            $("#modalData").show();

        }
    });
}


/* Create Cards */
function createInventary(movies, buys) {
    let html = '';
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    const role = userLogged.role;

    movies.map(function (element) {

        const isBuyMovie = buys.length > 0 ? buys.some(buy => buy.id_movie === element.id) : false;

        let buyBtn = '';
        if (isBuyMovie) {
            buyBtn = '';
        } else {
            if (element.inventary == 0) {
                buyBtn = '<p style="padding:6px;"> No Disponible </p>';
            } else {
                buyBtn = '<a onclick="openModalBuyMovie(\'' + element.id + '\', \'' + element.title + '\')" class="myButtonMovie buy">Comprar</a>';
            }
        }

        let viewBtn = isBuyMovie ? '<a onclick="openTrilerMovie(\'' + element.title + '\', \'' + element.link + '\', \'' + element.id + '\')" class="myButtonMovie">Ver</a>' : '';
        let actionButtons = '';

        if (role === 'User') {
            actionButtons = `<div style="display:flex; justify-content:center;">${buyBtn + viewBtn}</div>`;
        } else {
            actionButtons = '<div class="div-actions"> <a onclick="openModaleditMovie(\'' + element.id + '\', \'' + element.title + '\', \'' + element.description + '\', \'' + element.duration + '\', \'' + element.year + '\', \'' + element.autor + '\', \'' + element.genre + '\', \'' + element.visits + '\', \'' + element.calification + '\', \'' + element.link + '\', \'' + element.photo + '\', \'' + element.inventary + '\', \'' + element.price + '\')" class="myButtonMovie">Editar</a> <a onclick="openModaldeleteMovie(\'' + element.title + '\', \'' + element.id + '\')" class="myButtonMovie buy">Eliminar</a></div>';
        }

        let inventary = role === 'Admin' ?
            `<p style="background-color: #000000;text-align: center;padding: 10px;color:white;"> Inventario Actual: <b style="color: ${element.inventary < 10 ? 'red' : 'green'}">${element.inventary}</b> </p>` : '';

        const price = element.price ? parseFloat(element.price) : 0;
        const priceFormated = price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

        html += `
        <div class="card">
        <img src="${element.photo}" alt="Portada Movie">
        <div class="container">
          <h5><b>${element.title} - ${element.year} | ${element.genre}</b></h5>
          <hr style="margin-top: -17px;margin-bottom: 17px;">
          <p style="margin-top: -10px;">${element.duration}</p>
          <p class="description-movie">${element.description}</p>
            <div class="movie-info">
                <div class="div-genre">
                    
                </div>
                <div class="ratioPercent" style="--ratio: ${Number(element.calification).toFixed(2) / 10}; --colorPercent: ${element.calification >= 7 ? '#18c018' : element.calification >= 5 ? '#f7a019' : 'red'}">
                    <span class="percentSpan">${Math.floor(Number(element.calification).toFixed(2) * 10)}%</span>
                </div>
            </div>
           ${actionButtons}
           ${inventary}
        </div>
    </div>
    `;
    });
    $(".grid-inventary").html(html);
}

/* View Movie */
function openTrilerMovie(title, link, id) {

    /* Register Visit */
    const data = {
        id: id
    };

    const formData = $.param(data);
    let message = '';

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/incrementVisitMovie',
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const result = JSON.parse(response);
            message = result.message;
            viewMovie(title, link, message);
        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            message = err.message;
            viewMovie(title, link, message);
        }
    });


}

function viewMovie(title, link, message) {
    $("#dataInfoIncomplete").empty();
    $("#dataInfoIncompleteTitle").text(`Ver Pelicula - ${title}`);
    let html = `<div style="display:flex; justify-content:center;"><iframe width="420" height="345" src="${link}"></iframe></div><div style="margin-top:15px; text-align:center; color: ${message === "Visita Registrada Correctamente" ? 'green' : 'red'}"><b>${message}</b></div>`;
    $("#dataActions").html(html);
    $("#modalData").show();

    setTimeout(() => {
        sendMessage('View Movie');
    }, 100);

}


/* Edit Movie */
function openModaleditMovie(id, title, description, duration, year, autor, genre, visits, calification, link, photo, inventary, price) {

    let formEdit = `
    <input type="hidden" id="idEdit" name="idEdit" value="${id}">
    <div class="grid-container-edit">
        <div class="form-field">
            <label for="title">Titulo:</label>
            <input type="text" id="titleEdit" name="titleEdit" value="${title}">
        </div>
        <div class="form-field">
            <label for="description">Descripción:</label>
            <input type="text" id="descriptionEdit" name="descriptionEdit" value="${description}">
        </div>
        <div class="form-field">
            <label for="duration">Duración:</label>
            <input type="text" id="durationEdit" name="durationEdit" value="${duration}">
        </div>
        <div class="form-field">
            <label for="year">Año:</label>
            <input type="number" id="yearEdit" name="yearEdit" value="${year}">
        </div>
        <div class="form-field">
            <label for="year">Autor:</label>
            <input type="text" id="autorEdit" name="autorEdit" value="${autor}">
        </div>
        <div class="form-field">
            <label for="year">Género:</label>
            <input type="text" id="genreEdit" name="genreEdit" value="${genre}">
        </div>
        <div class="form-field">
            <label for="year">Calification:</label>
            <input type="number" id="calificationEdit" name="calificationEdit" value="${calification}">
        </div>
        <div class="form-field">
            <label for="year">Link Trailer:</label>
            <input type="text" id="linkEdit" name="linkEdit" value="${link}">
        </div>
        <div class="form-field">
            <label for="year">Link Photo:</label>
            <input type="text" id="photoEdit" name="photoEdit" value="${photo}">
        </div>
        <div class="form-field">
            <label for="year">Inventario:</label>
            <input type="number" id="inventaryEdit" name="inventaryEdit" value="${inventary}">
        </div>
        <div class="form-field">
            <label for="year">Precio:</label>
            <input type="number" step="0.1" id="priceEdit" name="priceEdit" value="${price}">
        </div>
        <div class="div-actions"> <a onclick="editMovie()" class="myButtonMovie">Editar</a></div>
    </div>`;

    $("#dataInfoIncompleteTitle").text(`Editar Pelicula - ${title}`);
    $("#dataActions").html(formEdit);
    $("#modalData").show();

    $("#dataActions input").click(function (event) {
        event.stopPropagation();
    });
}

function editMovie() {

    const data = {
        id: $("#idEdit").val(),
        title: $("#titleEdit").val(),
        description: $("#descriptionEdit").val(),
        duration: $("#durationEdit").val(),
        year: $("#yearEdit").val(),
        autor: $("#autorEdit").val(),
        genre: $("#genreEdit").val(),
        calification: $("#calificationEdit").val(),
        link: $("#linkEdit").val(),
        photo: $("#photoEdit").val(),
        inventary: $("#inventaryEdit").val(),
        price: $("#priceEdit").val(),
    };

    const formData = $.param(data);

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/editMovie',
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const result = JSON.parse(response);
            $("#dataInfoIncompleteTitle").text(`Editar Pelicula - ` + $("#titleEdit").val());
            $("#dataInfoIncomplete").text(`${result.message}`);
            $("#dataActions").empty();
            $("#modalData").show();
            getBuys();
        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            $("#dataInfoIncompleteTitle").text(`Error al Editar la Pelicula`);
            $("#dataInfoIncomplete").text(err.mensaje);
            $("#dataActions").empty();
            $("#modalData").show();
        }
    });



}


/* Buy Movie */
function openModalBuyMovie(id, title) {
    let formPayment = `
    <input type="hidden" id="idBuy" name="idBuy" value="${id}">
    <div class="grid-container-edit">
        <div class="form-field">
            <label for="title">Número de Tarjeta:</label>
            <input type="text" id="cardNumber" name="cardNumber" max="16" placeholder="1234 5678 9012 3456" required>
        </div>
        <div class="form-field">
            <label for="cardHolder">Titular de la Tarjeta:</label>
            <input type="text" id="cardHolder" name="cardHolder" placeholder="Nombre del titular" required>
        </div>
        <div class="form-field">
            <label for="expiryDate">Fecha de Expiración:</label>
            <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/AA" required>
        </div>
        <div class="form-field">
            <label for="cvv">CVV:</label>
            <input type="password" id="cvv" name="cvv" placeholder="123" required>
        </div>
        <div class="div-actions">
            <a onclick="validatePayment(${id})" class="myButtonMovie delete">Pagar</a>
        </div>
    </div>
    `;

    $("#dataInfoIncompleteTitle").text(`Comprar Pelicula - ${title}`);
    $("#dataActions").html(formPayment);
    $("#modalData").show();

    /* Function cardNumber */
    $('#cardNumber').on('input', function () {
        let cardNumber = $(this).val();
        let cardNumberOnly = cardNumber.replace(/-/g, '');

        if (cardNumberOnly.length > 16) {
            cardNumber = cardNumber.slice(0, 16);
            $(this).val(cardNumber);
        }

        if (cardNumberOnly.length % 4 == 0 && cardNumberOnly.length < 16) {
            cardNumber += '-';
            $(this).val(cardNumber);
        }
    });

    /* Function cardHolder */
    $('#cardHolder').on('input', function () {
        let cardHolder = $(this).val();
        let cardHolderReplace = cardHolder.replace(/[^a-zA-Z\s]/g, '');

        $(this).val(cardHolderReplace);
    });

    /* Function expiryDate */
    $('#expiryDate').on('input', function () {
        let expiryDate = $(this).val();
        let expiryDateOnly = expiryDate.replace(/\//g, '');

        if (expiryDateOnly.length > 4) {
            expiryDate = expiryDate.slice(0, 4);
            $(this).val(expiryDate);
        }

        if (expiryDateOnly.length % 2 == 0 && expiryDateOnly.length < 4) {
            expiryDate += '/';
            $(this).val(expiryDate);
        }
    });

    $("#dataActions input").click(function (event) {
        event.stopPropagation();
    });
}


function validatePayment(idMovie) {

    const userLogged = JSON.parse(localStorage.getItem('userData'));

    const cardNumber = $('#cardNumber').val();
    const cardHolder = $('#cardHolder').val();
    const expiryDate = $('#expiryDate').val();
    const cvv = $('#cvv').val();

    /* Validations */
    const cardNumberNoDashes = cardNumber.replace(/-/g, '');
    const isValidCardNumber = /^\d{16}$/.test(cardNumberNoDashes);
    const isValidCardHolder = /^[a-zA-Z\s]*$/.test(cardHolder);
    const isValidExpiryDate = /^\d{2}\/\d{2}$/.test(expiryDate);
    const isValidCvv = /^\d*$/.test(cvv);

    if (isValidCardNumber && isValidCardHolder && isValidExpiryDate && isValidCvv) {
        /* Send Buy */
        const data = {
            id_user: userLogged.id,
            id_movie: idMovie
        };
        payMovie(data);
    } else {
        alert("Ingrese correctamente los datos para pagar");
    }

}

function payMovie(data) {


    const formData = $.param(data);

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/registerBuy',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const resp = JSON.parse(response);

            $("#dataInfoIncompleteTitle").text(`Compra Finalizada`);
            $("#dataInfoIncomplete").text(resp.message);
            $("#dataActions").empty();
            $("#modalData").show();

            getBuys();

        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            console.log(err);
            $("#dataInfoIncompleteTitle").text(`Compra Fallida`);
            $("#dataInfoIncomplete").text(err.message);
            $("#dataActions").empty();
            $("#modalData").show();

        }
    });

    setTimeout(() => {
        sendMessage('Payment Obtiend');
    }, 100);
}

function sendMessage(message) {
    socket.send(message);
}


/* Delete Movie */
function openModaldeleteMovie(title, id) {
    let btnEliminar = '<div class="div-actions"> <a onclick="deleteMovie(\'' + id + '\')" class="myButtonMovie delete">Eliminar</a></div>';
    $("#dataInfoIncompleteTitle").text(`Eliminar Pelicula`);
    $("#dataInfoIncomplete").text(`¿Estás seguro que deseas eliminar la pelicula ${title}?`);
    $("#dataActions").html(btnEliminar);
    $("#modalData").show();
}

function deleteMovie(id) {

    const data = {
        id: id
    };
    const formData = $.param(data);

    $.ajax({
        url: 'http://localhost/samy-buster-api/api/deleteMovie',
        type: 'DELETE',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        success: function (response) {
            const result = JSON.parse(response);
            $("#dataInfoIncompleteTitle").text(`Eliminar Pelicula`);
            $("#dataInfoIncomplete").text(`${result.message}`);
            $("#dataActions").empty();
            $("#modalData").show();
            getBuys();
        },
        error: function (xhr, status, error) {
            const err = JSON.parse(xhr.responseText);
            $("#dataInfoIncompleteTitle").text(`Error al Eliminar la Pelicula`);
            $("#dataInfoIncomplete").text(err.mensaje);
            $("#dataActions").empty();
            $("#modalData").show();
        }
    });
}


/* Search Movie */
$("#key").change(function () {
    let key = $(this).val();
    let html = '';
    if (key == 'genre') {
        html = '<button class="searchGenre" key="Drama">Drama</button><button class="searchGenre" key="Amor">Amor</button><button class="searchGenre" key="Accion">Acción</button><button class="searchGenre" key="Terror">Terror</button><button class="searchGenre" key="Comedia">Comedia</button><button class="searchGenre" key="Infantil">Infantil</button><button class="searchGenre" key="all">Todas</button>';
    } else {
        html = '<input type="text" id="value" name="value" value="">';
        $("#searchDiv").html('<div><button class="myButtonMovie buy" id="searchMovie">Buscar</button></div>');
    }

    $(".button-container").html(html);

});


$("#searchDiv").click(function () {
    const key = $("#key").val();
    const value = $("#value").val();
    if (key !== '' && value !== '') {
        const data = {
            [key]: value
        };
        getBuys(data);
    } else {
        $("#dataInfoIncompleteTitle").text(`Ingresa un Filtro Válido`);
        $("#dataActions").empty();
        $("#modalData").show();
    }
});

$(document).on("click", ".searchGenre", function () {
    const key = $(this).attr("key");
    let data;
    if (key == 'all') {
        data = {};
    } else {
        data = {
            genre: key
        };
    }
    getBuys(data);

});




$(".close, .modal").click(function () {
    $("#modalData").hide();
});

function isBuyMovie(movie) {
    return movie.id_movie === movieToFind.id;
}
