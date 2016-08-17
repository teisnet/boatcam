"use strict";

var express = require('express');
var router = express.Router();
var User = require("../../models/User");
var passport = require("passport");
var jwt = require("jwt-simple");


router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization"); // Origin, X-Requested-With

	if(req.method === 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});


router.post("/authenticate", function(req, res) {
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if(err) throw error;

		if(!user) {
			res.send({ success: false, message: "Authentication failed. User not found"});
		} else {
			user.validPassword(req.body.password, function(err, isValid) {
				if (isValid && !err) {
					// TODO: Do only encode username, id and role
					var token = jwt.encode(user, "rodgrodmedflode"/*config.secret*/); // Teis: shouldn't token be arbitary, not generated from user
					res.json({ success: true, token: "JWT " + token });
				}  else {
					res.json({ success: false, message: "Authentication failed. Wrong password" });
				}
			});
		}
	});
});


router.use(passport.authenticate('jwt', { session: false }));


router.use(function (req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	// ? meta(http-equiv='Pragma', content='no-cache')
	// ? meta(http-equiv='Expires', content='-1')
	next();
});


router.get("/user", function(req, res){
	res.json(req.user);
});


require('./berthUsers')(router);
require('./users')(router);
require('./cameras')(router);
require('./berths')(router);
require('./berthCameraPositions')(router);

module.exports = router;
