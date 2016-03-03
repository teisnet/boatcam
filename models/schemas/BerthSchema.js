var mongoose = require('mongoose');

var BerthSchema = new mongoose.Schema({
    number: {
        type: String,
        trim: true,
        required: true,
        unique : true,
        validate: [
            {
                validator: function(value) { return /^[a-z0-9-_.]*$/.test(value); },
                message: "Value must only contain English lowercase characters and numbers, '{VALUE}' is not valid"
            },
            {
                validator: function(value) { return !/^[0-9a-fA-F]{24}$/.test(value); },
                message: "Value cannot be an ObjectId, '{VALUE}' is not valid"
            }
        ]
    },
	owner: String,
    positions: [{ camera: { type: mongoose.Schema.ObjectId, ref: "Camera" }, x: Number, y: Number, zoom: Number}]
});

module.exports = BerthSchema;