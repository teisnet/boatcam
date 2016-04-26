"use strict";

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String,
	role: {type: String, enum: ["Administrator", "Editor", "User"], default: "User"},
});


UserSchema.virtual("name")
	.get(function () {
		return (this.firstname || "") + (this.lastname && (" " + this.lastname) || "");
	});

module.exports = UserSchema;