"use strict";

const models  = require('../models'),
	User = models.User,
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
	{ passReqToCallback : true },
	function(req, username, password, done) {
		User.findOne({ where: { username: username } })
		.then(function(user) {
			if (!user) {
				done(null, false, req.flash('message', 'User Not found') );
			}
			user.validPassword(password, function (err, isEqual) {
				if (err) { return done(err); }
				if (!isEqual) {
					done(null, false, req.flash('message', 'Invalid Password') );
				} else {
					done(null, user);
				}
			});
			return null;
		})
		.catch((err) => {
			done(err);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id)
	.then((user) => {
		done(null, user);
		return null;
	})
	.catch((err) => {
		done(err);
	});
});
