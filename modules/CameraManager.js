var CameraManager = {};

var  Cam = require('onvif').Cam;

var status = {x: 0, y: 0, zoom: 0};
var previousStatus = {x: 0, y: 0, zoom: 0};

var Camera = new Cam({
  hostname: "192.168.1.112",
  username: "admin",
  password: "admin",
  port: "8080"
}, function(err, result) {
    if (err) { console.error("Could not initialize camera. (" + err.message + ")"); return; }
    console.log("Camera initialized.");
});



function move(direction) {
    console.log(direction);
    switch(direction) {
        case "stop":
            Camera.continuousMove({x: 0, y: 0}, function(){});
            break;
       case "left":
            Camera.continuousMove({x: -1.0, y: 0}, function(){});
            break;
       case "right":
            Camera.continuousMove({x: 1.0, y: 0}, function(){});
            break;
       case "up":
            Camera.continuousMove({x: 0, y: 1.0}, function(){});
            break;
       case "down":
            Camera.continuousMove({x: 0, y: -1.0}, function(){});
            break;
       case "zoomOut":
            Camera.continuousMove({x: 0, y: 0, zoom: -1}, function(){});
            break;
       case "zoomIn":
            Camera.continuousMove({x: 0, y: 0, zoom: 1}, function(){});
            break;
    }

    updateStatus();

}

function updateStatus() {

    Camera.getStatus(function(err, currentStatus){
        console.log(status, null, 2);
        previousStatus = status;
        status = currentStatus.position;

        if ((previousStatus.x != status.x) || (previousStatus.y != status.y) || (previousStatus.zoom != status.zoom)) {
            setTimeout(updateStatus, 50);
        }

        io.emit("status", status);
    });
}

module.exports = function(_io)
{
    io = _io;
    io.on('connection', function(socket){
        console.log("A user connected");
        socket.on("move", move);
    });
    //return CameraManager;
}