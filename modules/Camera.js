const EventEmitter = require('events').EventEmitter;

var CameraManager = new EventEmitter();

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
    /*setInterval(function(){
        Camera.absoluteMove({x:9200.0, y:2500.0, zoom:1000.0});
    }, 1000);*/
});


CameraManager.set = function(position) {
    absoluteTarget = {x: parseFloat(position.x), y: parseFloat(position.y), zoom: parseFloat(position.zoom) };
    //absoluteTarget = {x:9200.0, y:2500.0, zoom:1000.0};
    Camera.absoluteMove(absoluteTarget, function(){});
    absoluteInProgress = true;
    // Order: x, zoom, y
    // 
    updateStatus();
}


CameraManager.move = function(direction) {
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

    //setTimeout(updateStatus, 100);
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

        CameraManager.emit("status", status);
    });
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


module.exports = CameraManager;
