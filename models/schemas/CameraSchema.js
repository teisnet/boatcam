var mongoose = require('mongoose');
var IpCamera = require("../../modules/Camera");

var CameraSchema = new mongoose.Schema({
    enabled: Boolean,
    slug: { type: String, lowercase: true, trim: true }, // Lowercase, no danish letters. Used for urls and logging. "ostrebassin"
	title: String,
    uri: String,
    hostname: String,
    onvif: Number,
    http: Number,
    username: { type: String, trim: true },
    password: { type: String, trim: true }
});


// available post events: init, validate, save, remove

CameraSchema.post('init', function(doc) {
    this.camera = IpCamera.get(doc._id);
    if (!this.camera) { this.camera = new IpCamera(doc); }
});

CameraSchema.virtual("name")
	.get(function () { return this.slug; });

CameraSchema.virtual("position")
	.get(function () { return this.camera.position; });

CameraSchema.virtual("online")
	.get(function () { return this.camera.online; });

CameraSchema.virtual("status")
	.get(function () { return this.camera.status; });

CameraSchema.methods.move = function (command) {
    this.camera.move(command);
};

CameraSchema.methods.moveTo = function (pos) {
    this.camera.moveTo(pos);
};

CameraSchema.methods.snapshot = function (err, cb) {
    this.camera.snapshot(err, cb);
};

CameraSchema.methods.onMove = function (handler) {
    this.camera.on("move", handler);
};

CameraSchema.methods.onStatus = function (handler) {
    this.camera.on("status", handler);
};

module.exports = CameraSchema;
