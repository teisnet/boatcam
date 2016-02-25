var mongoose = require('mongoose');

var BerthSchema = new mongoose.Schema({
	number: String,
	owner: String,
    positions: [{ camera: { type: mongoose.Schema.ObjectId, ref: "Camera" }, x: Number, y: Number, zoom: Number}]
});

module.exports = BerthSchema;