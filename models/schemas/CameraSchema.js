var mongoose = require('mongoose');

var CameraSchema = new mongoose.Schema({
	name: String,
	title: String,
    uri: String,
    hostname: String,
    onvif: Number,
    username: String,
    password: String
});

module.exports = CameraSchema;