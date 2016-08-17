"use strict";

var mongoose = require('mongoose');

var BerthUserSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.ObjectId, ref: "User" },
	berth:  { type: mongoose.Schema.ObjectId, ref: "Berth" }
});

module.exports = BerthUserSchema;
