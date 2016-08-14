"use strict";

var express = require('express');
var router = express.Router();
var User = require("../../models/User");
var passport = require("passport");
var jwt = require("jwt-simple");


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
					var token = jwt.encode(user, "rodgrodmedflode"/*config.secret*/); // Teis: shouldn't token be arbitary, not generated from user
					res.json({ success: true, token: "JWT " + token });
				}  else {
					res.json({ success: false, msg: "Authentication failed. Wrong password" });
				}
			});
		}
	});
});


router.use(passport.authenticate('jwt', { session: false }));


router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
	next();
});

router.use(function (req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	// ? meta(http-equiv='Pragma', content='no-cache')
	// ? meta(http-equiv='Expires', content='-1')
	next();
});


require('./berthUsers')(router);
require('./users')(router);
require('./cameras')(router);
require('./berths')(router);
require('./berthCameraPositions')(router);

module.exports = router;
