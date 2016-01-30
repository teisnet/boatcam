var socket = io();
console.log("Camera");

socket.on("status", function(status){
    status.x = parseFloat(status.x / 100).toFixed(1);
    status.y = parseFloat(status.y / 100).toFixed(1);
    status.zoom = parseFloat(status.zoom / 1000).toFixed(1);
    
    $('.status').text("x: " + status.x + "\xB0 y: " + status.y + "\xB0 zoom: " + status.zoom + "x");
});

function beginMoveCamera(direction){
    console.log("moveCamera: " + direction);
    socket.emit('move', direction);
    
    $(document).bind("mouseup", stopCamera);
}


function stopCamera() {
    socket.emit('move', "stop");
    $(document).unbind("mouseup", stopCamera);
}