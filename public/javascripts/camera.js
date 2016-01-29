var socket = io();
console.log("Camera");

socket.on("status", function(status){
    //console.log("Status "+ status);
    $('.status').text("x: " + status.x + "    y: " + status.y + " zoom: " + status.zoom);
});

function beginMoveCamera(direction){
    console.log("moveCamera: " + direction);
    socket.emit('move', direction);
}


function stopCamera() {
    socket.emit('move', "stop");
}