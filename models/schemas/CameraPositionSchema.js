var mongoose = require('mongoose');
var IpCamera = require("../../modules/Camera");

var CameraPositionSchema = new mongoose.Schema({
    camera: { type: mongoose.Schema.ObjectId, ref: "Camera" },
    berth:  { type: mongoose.Schema.ObjectId, ref: "Berth" },
    x: Number,
    y: Number,
    zoom: Number
});

module.exports = CameraPositionSchema;
