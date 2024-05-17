const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function (event) {
    console.log("Conexión Abierta");
    socket.send('Hello Me!');
};

socket.onmessage = function (e) { 
    console.log(e.data); 
};

