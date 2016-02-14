var mongoose = require('mongoose');
var IpCamera = require("../../modules/Camera");

var CameraSchema = new mongoose.Schema({
	name: String,
	title: String,
    uri: String,
    hostname: String,
    onvif: Number,
    username: String,
    password: String
});


CameraSchema.post('init', function(doc) {
    this.camera = IpCamera.get(doc._id);
    if (!this.camera) { this.camera = new IpCamera(doc); }
});

CameraSchema.virtual("position")
	.get(function () { return this.camera.position; });

CameraSchema.methods.move = function (command) {
    this.camera.move(command);
};

CameraSchema.methods.onMove = function (handler) {
    this.camera.on("move", handler);
};

CameraSchema.methods.moveTo = function (pos) {
    this.camera.moveTo(pos);
};

module.exports = CameraSchema;
