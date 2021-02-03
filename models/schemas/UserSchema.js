"use strict";

var mongoose = require('mongoose');
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String, //{ type: String, select: false },
	role: {type: String, enum: ["Administrator", "Editor", "User"], default: "User"},
}, {
	// toObject: { virtuals: true },
	toJSON: {
		virtuals: true,
		transform: function(doc, user) {
			delete user.password;
		}
	}
});


// PASSWORD
UserSchema.pre("save", function(next) {
	var user = this;
	if(this.isModified("password") || this.isNew) {
		bcrypt.genSalt(10, function(err, salt) {
			if(err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function(err, hash) {
				if(err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.validPassword = function(pw, cb) {
	if (pw === this.password) { return cb(null, true); }

	bcrypt.compare(pw, this.password, function(err, isEqual) {
		if(err) {
			return cb(err);
		}
		cb(null, isEqual);
	});
};


//
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
