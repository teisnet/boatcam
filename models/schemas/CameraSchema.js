var mongoose = require('mongoose');

var CameraSchema = new mongoose.Schema({
	name: String,
	title: String,
    uri: String
});

module.exports = CameraSchema;