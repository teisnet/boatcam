"use strict";

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String,
	role: {type: String, enum: ["Administrator", "Editor", "User"], default: "User"},
}, {
	// toObject: { virtuals: true },
	toJSON: { virtuals: true }
});


UserSchema.virtual("name")
	.get(function () {
		return (this.firstname || "") + (this.lastname && (" " + this.lastname) || "");
	});


UserSchema.methods.populateBerths = function populateBerths (cb) {
	return this.model('BerthUser').find({ user: this._id})
	.populate("berth")
	.exec()
	.then( (berthUsers) => {
		if (cb) cb(undefined, this);
		this._berths = berthUsers;
		return this;
	})
	.catch(function(err){
		// Catch, call callback with error and re-reject
		if (cb) cb(err);
		return Promise.reject(err);
	});
};


UserSchema.virtual("berths")
	.get(function () { return this._berths; });


module.exports = UserSchema;
