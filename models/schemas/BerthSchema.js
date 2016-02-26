var mongoose = require('mongoose');
var CameraPosition = require('../CameraPosition');

var BerthSchema = new mongoose.Schema({
	number: String,
	owner: String,
    positions: [{ ref: "CameraPosition" }]
});


module.exports = BerthSchema;
