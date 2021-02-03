"use strict";

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
	owner: String
}, {
	// toObject: { virtuals: true },
	toJSON: { virtuals: true }
});


BerthSchema.methods.populateCameraPositions = function populateCameraPositions (cb) {
		return this.model('CameraPosition').find({ berth: this._id})
		.populate("camera")
		.exec()
		.then( (berthCameraPositions) => {
			this._cameraPositions = berthCameraPositions;
		}); // TODO: Catch
	/*
	.catch(function(err){
		// Catch, call callback with error and re-reject
		cb(err);
		return Promise.reject(err);
	});*/
};


BerthSchema.methods.populateUsers = function populateUsers (cb) {
	return this.model('BerthUser').find({ berth: this._id})
	.populate("user")
	.exec()
	.then( (berthUsers) => {
		if (cb) cb(undefined, this);
		this._users = berthUsers;
		return this;
	})
	.catch(function(err){
		// Catch, call callback with error and re-reject
		if (cb) cb(err);
		return Promise.reject(err);
	});
};


BerthSchema.virtual("cameraPositions")
	.get(function () { return this._cameraPositions; });

BerthSchema.virtual("users")
	.get(function () { return this._users; });

module.exports = BerthSchema;
