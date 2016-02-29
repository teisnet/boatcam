var mongoose = require('mongoose');

var BerthSchema = new mongoose.Schema({
    number: {
        type: String,
        trim: true,
        required: true,
        unique : true,
        validate: {
            validator: function(value) {
                return /^[a-z0-9-_.]*$/.test(value);
            },
            message: 'Field "number" must only contain english lowercase characters and numbers ("{VALUE}")'
        }
    },
	owner: String,
    positions: [{ camera: { type: mongoose.Schema.ObjectId, ref: "Camera" }, x: Number, y: Number, zoom: Number}]
});

module.exports = BerthSchema;