var CameraManager = {};

var  Cam = require('onvif').Cam;

var status = {x: 0, y: 0, zoom: 0};
var previousStatus = {x: 0, y: 0, zoom: 0};

var absoluteTarget = {x: 0, y: 0, zoom: 0};
var absoluteInProgress = false;
var isMoving = false;

var Camera = new Cam({
  hostname: "85.27.160.128",
  username: "admin",
  password: "admin",
  port: "8080"
}, function(err, result) {
    if (err) { console.error("Could not initialize camera. (" + err.message + ")"); return; }
    console.log("Camera initialized.");
});


function set(position) {
    absoluteTarget = {x: parseFloat(position.x), y: parseFloat(position.y), zoom: parseFloat(position.zoom) };
    Camera.absoluteMove(absoluteTarget, function(){});
    absoluteInProgress = true;
    // Order: x, zoom, y
    // 
    updateStatus();
}


function move(direction) {
    //console.log(direction);
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
        //console.log(status, null, 2);
        previousStatus = status;
        status = currentStatus.position;

        if ((previousStatus.x != status.x) || (previousStatus.y != status.y) || (previousStatus.zoom != status.zoom)) {
            isMoving = true;
            setTimeout(updateStatus, 50);
        } else {
            isMoving = false;
            checkAbsoluteStatus();
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

function checkAbsoluteStatus() {
    if (absoluteInProgress) {
        if((absoluteTarget.x != status.x) || (absoluteTarget.y != status.y) || (absoluteTarget.zoom != status.zoom)) {
            CameraManager.set(absoluteTarget);
            console.log("Absolute repeat");
        } else {
            absoluteInProgress = false;
            console.log("Absolute finished");
        }
    }
}

