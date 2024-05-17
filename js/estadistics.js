
$(document).ready(function () {
    validateSession();
});

function validateSession() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    if (!userLogged) {
        logOut();
    } else {
        const validateDate = validateDateSession(userLogged.created_at_session);
        if (validateDate) {
            logOut();
        }
        initReports();
    }
}


/* Init Reports */
function initReports() {
    getClients();
    getMostBuys();
    getMostVisit();
    getMostCalification();
}

function destroyCharts() {
    $("canvas#grafic-clients").remove();
    $("canvas#movie-most-buy").remove();
    $("canvas#movie-most-visits").remove();
    $("canvas#movie-most-calification").remove();

    initReports();
}

/* Graphics */
function createEstadisticsClients(clients) {
    $("#reportOne").append('<canvas id="grafic-clients" class="report"></canvas>');
    const ctx = document.getElementById('grafic-clients').getContext('2d');

    const graficClients = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
                label: 'N° Clientes Registrados',
                data: clients,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createMovieMostBuy(buys) {
    $("#reportTwo").append('<canvas id="movie-most-buy" class="report"></canvas>');
    let ctx = document.getElementById('movie-most-buy').getContext('2d');

    let data = {
        labels: buys[1],
        datasets: [{
            label: 'Peliculas más compradas',
            data: buys[0],
            backgroundColor: buys[2],
            borderColor: buys[2],
            borderWidth: 1
        }]
    };

    let options = {
        responsive: false,
        maintainAspectRatio: false
    };

    let myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

function createMovieMostVisits(buys) {
    $("#reportThree").append('<canvas id="movie-most-visits" class="report"></canvas>');
    let ctx = document.getElementById('movie-most-visits').getContext('2d');

    let data = {
        labels: buys[1],
        datasets: [{
            label: 'Peliculas más visitadas',
            data: buys[0],
            backgroundColor: buys[2],
            borderColor: buys[2],
            borderWidth: 1
        }]
    };

    let options = {
        responsive: false,
        maintainAspectRatio: false
    };

    let myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

function createMovieMostCalification(buys) {
    $("#reportFour").append('<canvas id="movie-most-calification" class="report"></canvas>');
    let ctx = document.getElementById('movie-most-calification').getContext('2d');

    let data = {
        labels: buys[1],
        datasets: [{
            label: 'Peliculas mejor Calificadas',
            data: buys[0],
            backgroundColor: buys[2],
            borderColor: buys[2],
            borderWidth: 1
        }]
    };

    let options = {
        responsive: false,
        maintainAspectRatio: false
    };

    let myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}


/* Function Api */
function getClients() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    socket.send('Clients Obtiend');
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getUsersRegisterMonth',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + userLogged.token
        },
        success: function (response) {
            const clients = JSON.parse(response);
            createEstadisticsClients(clients);
        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Obtener los Datos`);
            $("#modalData").show();

        }
    });
}

function getMostBuys() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getMoviesMostBuy',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + userLogged.token
        },
        success: function (response) {
            const buys = JSON.parse(response);
            createMovieMostBuy(buys);
        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Obtener los Datos`);
            $("#modalData").show();

        }
    });
}

function getMostVisit() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getMoviesMostVisit',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + userLogged.token
        },
        success: function (response) {
            const buys = JSON.parse(response);
            createMovieMostVisits(buys);
        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Obtener los Datos`);
            $("#modalData").show();

        }
    });
}

function getMostCalification() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    $.ajax({
        url: 'http://localhost/samy-buster-api/api/getMoviesMostCalification',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + userLogged.token
        },
        success: function (response) {
            const buys = JSON.parse(response);
            createMovieMostCalification(buys);
        },
        error: function (xhr, status, error) {
            $("#dataInfoIncompleteTitle").text('Ocurrió un Error');
            $("#dataInfoIncomplete").text(`Ocurrió un Error al tratar de Obtener los Datos`);
            $("#modalData").show();

        }
    });
}


socket.onmessage = function (e) {
    let message = e.data;
    if (message == 'Payment Obtiend') {
        destroyCharts();
    } else if (message == 'View Movie') {
        destroyCharts();
    } else if ('Register New User') {
        destroyCharts();
    }
};


function logOut() {
    localStorage.removeItem('userData');
    window.location.href = '../index.html?signOut';
}