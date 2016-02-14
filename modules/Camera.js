const EventEmitter = require('events').EventEmitter;
const util = require('util');
var OnvifCam = require('onvif').Cam;

var cameras = {};

function Camera(settings) {
    EventEmitter.call(this);
    var self = this;

    // TODO: Handle missing id. Consider using name.
    cameras[settings._id] = this;

    this.name = settings.name;
    // Position , moveTarget and previousPosition in degrees (not internal camera values)
    this._position = {x: 0, y: 0, zoom: 0};
    this._isMoving = false;
    this._isMovingTo = false;
    this._online = false,
    this._moveTarget = {x: 0, y: 0, zoom: 0};
    this._previousPosition = {x: 0, y: 0, zoom: 0};

    this._onvifCamera = new OnvifCam({
        hostname: settings.hostname,
        username: settings.username,
        password: settings.password,
        port:     settings.onvif,
        }, function(err, result) {
            if (err) {
                 console.error("Camera[" + self.name + "]: could not initialize camera (" + err.message + ")");
                 return;
            }
            console.log("Camera[" + self.name + "] initialized");
            self._online = true;
            self._updateStatus();
        });
};

util.inherits(Camera, EventEmitter);


Camera.get = function(id) { return cameras[id]; }

Camera.prototype._updateStatus = function(message) {
    var self = this;
    this._onvifCamera.getStatus(function(err, status){
        if (err) {
            console.error("Camera[" + self.name + "].updateStatus: " + err.message + ")");
            this._online = false;
            return;
        }
        console.log("Camera[" + self.name + "].updateStatus: recieved " + JSON.stringify(status.position) );
        self._previousPosition = self._position;
        var pos = self._position = cameraToDegrees(status.position);

        if (!posIsEqual(self._previousPosition, pos)) {
            self._isMoving = true;
            setTimeout(() => self._updateStatus(), 50);
            console.log("Camera[" + self.name + "] move event: " +  JSON.stringify(pos));
            self.emit("move", pos);
        } else {
            self._isMoving = false;

            if (self._isMovingTo) {
                if(posIsEqual(self._moveTarget, pos)) {
                    self._isMovingTo = false;
                    console.log("Camera[" + self.name + "] movingTo finished: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
                } else {
                    // TODO: Implement repeat limit and error reporting
                    self.moveTo(self._moveTarget);
                    console.log("Camera[" + self.name + "] movingTo repeat: x=" + pos.x + ", y=" + pos.y + ", zoom=" + pos.zoom);
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

Object.defineProperty(Camera.prototype, "online", {
    get: function online() { return this._online; }
});

Object.defineProperty(Camera.prototype, "position", {
    get: function position() { return this._position; }
});

Camera.prototype.moveTo = function(position) {
    console.log("Camera[" + this.name + "].moveTo: " +  JSON.stringify(position));
    this._moveTarget = position;
    // TODO: Test for callback error when offline
    // Camera move operations order: x, zoom, y
    this._onvifCamera.absoluteMove(degreesToCamera(this._moveTarget), function(){});
    this._isMovingTo = true;
    setTimeout(() => this._updateStatus(), 100);
}


Camera.prototype.move = function(command) {
    console.log("Camera[" + this.name + "].move: " +  command);
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
    // TODO: Test for callback error when offline
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
