
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
        createPage(userLogged.role);
    }
}

function validateDateSession(date) {

    const created_at_session = new Date(date);
    const currentDate = new Date();
    const differenceInMs = currentDate - created_at_session;
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    return differenceInDays > 7;
}


function createPage(role) {
    createNav(role);
    setInterval(getHour, 1000);
}


function createNav(role) {

    let html = null;

    if (role === 'Admin') {
        html = `
        <input type='checkbox' id='responsive-menu'>
        <label for="responsive-menu"></label>
        <ul>
            <li class="title-nav">SAMYBUSTER | PANEL ADMIN</li>
            <li><a onclick="showEstadistics()">Estadísticas</a></li>
            <li><a onclick="showInventary()">Inventario</a></li>
            <li id="hour" style="color:yellow; margin: 10px; font-weight: bolder;">Hola</li>
            <li><a onclick="logOut()">Cerrar Sesión <i class="fa fa-sign-out"></i></a></li>
        </ul>
    `;

    } else {
        html = `
        <input type='checkbox' id='responsive-menu'>
        <label for="responsive-menu"></label>
        <ul>
            <li class="title-nav">SAMYBUSTER | CLIENT</li>
            <li><a onclick="showInventary()">Peliculas</a></li>
            <li><a onclick="showBuys()">Compras</a></li>
            <li id="hour" style="color:yellow; margin: 10px; font-weight: bolder;">Hola</li>
            <li><a onclick="logOut()">Cerrar Sesión <i class="fa fa-sign-out"></i></a></li>
        </ul>
    `;
    }


    $('#menu').html(html);
    showInventary();


}


function showEstadistics() {
    $('#body').empty();
    $('#body').load('estadistics.html');
}

function showInventary() {
    $('#body').empty();
    $('#body').load('inventary.html');
}

function showBuys() {
    $('#body').empty();
    $('#body').load('buys.html');
}


function logOut() {
    localStorage.removeItem('userData');
    window.location.href = '../index.html?signOut';
}


function getHour() {
    const date = new Date();
    const configDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const cofigHpur = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const dateFormat = date.toLocaleDateString('es-ES', configDate);
    const hourFormat = date.toLocaleTimeString('es-ES', cofigHpur);

    document.getElementById('hour').textContent = `${dateFormat} - ${hourFormat}`;
}
