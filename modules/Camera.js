const EventEmitter = require('events').EventEmitter;
var OnvifCam = require('onvif').Cam;
var Camera = new EventEmitter();


var isMoving = false;
var isMovingTo = false;
var moveTarget = {x: 0, y: 0, zoom: 0};
Camera.position = {x: 0, y: 0, zoom: 0};
var previousPosition = {x: 0, y: 0, zoom: 0};


var OnvifCamera = new OnvifCam({
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


Camera.moveTo = function(position) {
    moveTarget = {x: parseFloat(position.x), y: parseFloat(position.y), zoom: parseFloat(position.zoom) };
    //absoluteTarget = {x:9200.0, y:2500.0, zoom:1000.0};
    OnvifCamera.absoluteMove(moveTarget, function(){});
    isMovingTo = true;
    // Order: x, zoom, y
    //
    setTimeout(updateStatus, 100);
}


Camera.move = function(command) {
    //console.log(direction);
    var direction = {x: 0, y: 0};
    switch(command) {
        case "stop":
            break;
       case "left":
            direction.x = -1.0;
            break;
       case "right":
            direction.x = 1.0;
            break;
       case "up":
            direction.y = 1.0;
            break;
       case "down":
            direction.y = -1.0;
            break;
       case "zoomOut":
            direction.zoom = -1.0;
            break;
       case "zoomIn":
            direction.zoom = 1.0;
            break;
    }
    OnvifCamera.continuousMove(direction, function(){});
    isMovingTo = false;
    //setTimeout(updateStatus, 100);
    updateStatus();

}

function isEqual(a, b) {
    var margin = 5;
    return a > (b - margin) && a < (b + margin) ? true : false;
}

function posIsEqual(a, b) {
    return isEqual(a.x, b.x) && isEqual(a.y, b.y) && isEqual(a.zoom, b.zoom);
}

function updateStatus() {

    OnvifCamera.getStatus(function(err, status){
        //console.log(status, null, 2);
        previousPosition = Camera.position;
        var pos = Camera.position = status.position;

        if (!posIsEqual(previousPosition, pos)) {
            isMoving = true;
            setTimeout(updateStatus, 50);
            Camera.emit("move", pos);
        } else {
            isMoving = false;

            if (isMovingTo) {
                if(posIsEqual(moveTarget, pos)) {
                    isMovingTo = false;
                    console.log("MovingTo finished: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
                } else {
                    Camera.moveTo(moveTarget);
                    console.log("MovingTo repeat: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
                }
            }
        }
    });
}


module.exports = Camera;
