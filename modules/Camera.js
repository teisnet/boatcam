const EventEmitter = require('events').EventEmitter;
const util = require('util');
var OnvifCam = require('onvif').Cam;


function Camera(settings) {
    EventEmitter.call(this);
    var self = this;

    // Position , moveTarget and previousPosition in degrees (not internal camera values)
    this._position = {x: 0, y: 0, zoom: 0};
    this._isMoving = false;
    this._isMovingTo = false;
    this._moveTarget = {x: 0, y: 0, zoom: 0};
    this._previousPosition = {x: 0, y: 0, zoom: 0};

    this._onvifCamera = new OnvifCam({
        hostname: settings.hostname, //"85.27.160.128",
        username: settings.username,//"admin",
        password: settings.password,//"admin",
        port:     settings.onvif,// "8080"
        }, function(err, result) {
            if (err) { console.error("Could not initialize camera. (" + err.message + ")"); return; }
            console.log("Camera initialized.");
            self._updateStatus();
        });
};

util.inherits(Camera, EventEmitter);


Camera.prototype._updateStatus = function(message) {
    var self = this;
    this._onvifCamera.getStatus(function(err, status){
        if (err) { console.error("Could not get camera status. (" + err.message + ")"); return; }

        self._previousPosition = self._position;
        var pos = self._position = cameraToDegrees(status.position);

        if (!posIsEqual(self._previousPosition, pos)) {
            self._isMoving = true;
            setTimeout(() => self._updateStatus(), 50);
            // TODO: Ensure repeat limit
            self.emit("move", pos);
        } else {
            self._isMoving = false;

            if (self._isMovingTo) {
                if(posIsEqual(self._moveTarget, pos)) {
                    self._isMovingTo = false;
                    console.log("MovingTo finished: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
                } else {
                    self.moveTo(self._moveTarget);
                    // TODO: Create repeat limit and error reporting
                    console.log("MovingTo repeat: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
                }
            }
        }
    });
}

// Internal camera values are: x and y = x100, zoom = x1000
function cameraToDegrees(internalPos) {
    return {x: internalPos.x / 100.0, y: internalPos.y / 100.0, zoom: internalPos.zoom / 1000.0 };
}

function degreesToCamera(degreesPos) {
    return {x: degreesPos.x * 100, y: degreesPos.y * 100, zoom: degreesPos.zoom * 1000.0 }; // parseFloat
}

Object.defineProperty(Camera.prototype, "position", {
    get: function position() { return this._position; }
});

Camera.prototype.moveTo = function(position) {
    this._moveTarget = position;
    // Camera move operations order: x, zoom, y
    this._onvifCamera.absoluteMove(degreesToCamera(this._moveTarget), function(){});
    this._isMovingTo = true;
    setTimeout(() => this._updateStatus(), 100);
}


Camera.prototype.move = function(command) {
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
    this._onvifCamera.continuousMove(direction, function(){});
    this._isMovingTo = false;
    setTimeout(() => this._updateStatus(), 100);
    //this._updateStatus();

}

function isEqual(a, b, m) {
    var margin = m || 0.04;
    return a > (b - margin) && a < (b + margin) ? true : false;
}

function posIsEqual(a, b) {
    return isEqual(a.x, b.x) && isEqual(a.y, b.y) && isEqual(a.zoom, b.zoom, 0.004);
}

module.exports = Camera;
