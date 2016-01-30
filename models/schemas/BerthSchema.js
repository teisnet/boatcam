var mongoose = require('mongoose');

var BerthSchema = new mongoose.Schema({
	number: String,
	owner: String,
    positions: [{ cameraId: mongoose.schema.ObjectId, x: Number, y: Number, zoom: Number}]
});

module.exports = BerthSchema;