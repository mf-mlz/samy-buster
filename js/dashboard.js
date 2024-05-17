
$(document).ready(function () {
    validateSession();
});



function validateSession() {
    const userLogged = JSON.parse(localStorage.getItem('userData'));
    if (!userLogged) {
        window.location.href = '../index.html?signOut';
    } else {
        createPage(userLogged.role);
    }
}


function createPage(role) {
    createNav(role);
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


function logOut() {
    localStorage.removeItem('userData');
    window.location.href = '../index.html?signOut';
}
