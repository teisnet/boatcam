"use strict";

var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require('passport');

// Load the user model
const models  = require('../models');
const User = models.User;


///
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// Load the user model

var opts = {};
opts.secretOrKey = "rodgrodmedflode"; // TODO: From config;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	User.findById(jwt_payload.id)
	.then(function(user) {
		if(user) {
			done(null, user);
		} else {
			done(null, false);
		}
		return null;
	})
	.catch((err) => {
		done(err, false);
	});
}));
