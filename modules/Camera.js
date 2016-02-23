"use strict";

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const OnvifCam = require('onvif').Cam;
var http = require('http');
var fs = require('fs');
var path = require("path");

const cameras = {};

var reconnectTime = 7000;

function Camera(settings) {
    EventEmitter.call(this);
    var self = this;

    // TODO: Handle missing id. Consider using name.
    cameras[settings._id] = this;

    this.name = settings.name;
    // Position , moveTarget and previousPosition in degrees (not internal camera values)
    this._position = {x: 0, y: 0, zoom: 0};
    this._pendingStatus = false;
    this._isMoving = false;
    this._isMovingTo = false;
    this._online = false;
    this._moveTarget = {x: 0, y: 0, zoom: 0};
    this._previousPosition = {x: 0, y: 0, zoom: 0};
    this._settings = settings;

    this._onvifCamera = new OnvifCam({
        hostname: settings.hostname,
        username: settings.username,
        password: settings.password,
        port:     settings.onvif,
        }, function(err, result) {
            if (err) {
                 console.error("Camera[" + self.name + "]: could not initialize camera (" + err.message + ")");
                 //setTimeout(function(){ self.connect(); }, reconnectTime);
                 return;
            }
            console.log("Camera[" + self.name + "] initialized");
            self._setOnline(true);
            self._updateStatus();
        });

    setInterval(() => self.connect(), reconnectTime);
};

util.inherits(Camera, EventEmitter);


Camera.get = function(id) { return cameras[id]; }

Camera.prototype.connect = function() {
    if (this._online) {
        this._updateStatus();
        return;
    }
    var self = this;

    this._onvifCamera.connect(function(err, result){
        if (err) {
            console.error("Camera[" + self.name + "]: could not initialize camera (" + err.message + ")");
            // Still disconnected. Try again later.
            //setTimeout(function(){ self.connect(); }, reconnectTime);
            return;
        }
        console.log("Camera[" + self.name + "] initialized");
        self._setOnline(true);
        self._updateStatus();
    });
}

Camera.prototype._setOnline = function(value) {
    if (this._online == value) return;

    this._online = value;
    this.emit("online", this._online);
}

Camera.prototype._updateStatus = function(message) {
    if (this._pendingStatus || !this._onvifCamera) return;
    var self = this;

    this._pendingStatus = true;

    this._onvifCamera.getStatus(function(err, status){
        self._pendingStatus = false;
        if (err) {
            console.error("Camera[" + self.name + "].updateStatus: " + err.message + ")");
            self._setOnline(false);
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

Camera.prototype.snapshot = function(cb) {
    var self = this;
    if (!this._onvifCamera) return;
    this._onvifCamera.getSnapshotUri(function(err, result){
        if (err) {
            console.error("Camera[" + self.name + "].snapshot: " + err.message + ")");
            cb(err);
            return;
        }

        let credentials = self._settings.username + ":" + self._settings.password + "@";
        let snapshotUri = "http://" + credentials + self._settings.hostname + ":" + self._settings.http +  result.uri.replace(/^.*\/\/[^\/]+/, '');

        console.log("Camera[" + self.name + "].snapshot: " +  snapshotUri);

        let timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
        let SnapshotFilename = "files/snapshot_" + self.name + "-" + timestamp + ".jpg";

        download(snapshotUri, "temp", SnapshotFilename, function(filePath){ cb(null, filePath); });
    });
}

function isEqual(a, b, m) {
    var margin = m || 0.04;
    return a > (b - margin) && a < (b + margin) ? true : false;
}

function posIsEqual(a, b) {
    return isEqual(a.x, b.x) && isEqual(a.y, b.y) && isEqual(a.zoom, b.zoom, 0.004);
}

module.exports = Camera;

function download(url, tempFilepath, filepath, callback) {
    var file = fs.createWriteStream(filepath);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(callback);  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(filepath); // Delete the file async. (But we don't check the result)
    if (callback) callback(err.message);
    });
};

/*
let snapshotFile = fs.createWriteStream(SnapshotFilename);
        snapshotFile.on("open", function(){
            http.get(snapshotUri, function(res) {
                res.pipe(snapshotFile);
                cb(null, SnapshotFilename);
            });
        });
        */
/*
function download(url, tempFilepath, filepath, callback) {
   var tempFile = fs.createWriteStream(path.join(__dirname, "../", tempFilepath));
   tempFile.on('open', function(fd) {
        http.get(url, function(res) {
            res.on('data', function(chunk) {
                tempFile.write(chunk);
            }).on('end', function() {
                tempFile.end();
                fs.renameSync(tempFile.path, path.join(__dirname, "../", filepath));
                return callback(filepath);
            }).on("error", function(){
                console.log("Error download");
            });
        });
    });
}*/
