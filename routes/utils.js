"use strict";

const path = require("path");
const Camera = require("../models/Camera");
const Berth = require("../models/Berth");
const User = require("../models/User");


module.exports = function(router) {

	function hasRoute(value) {
		let length = router.stack.length;
		for (let i = 0; i < length; i++) {
			let route = router.stack[i];
			if (route.route && route.route.methods.get) {
				console.log(route.route.path);
				if(route.regexp.test(value)) {
					return true;
				}
			}
		}
		return false;
	}


	router.use(function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		if (hasRoute(req.path)) {
			req.session.returnTo = path.join(req.baseUrl, req.path);
		}
		res.redirect('/login');
	});

	router.use(function (req, res, next) {
		res.locals.authenticatedUser = req.user;
		next();
	});

// OK
	router.param("cameraSlug", function (req, res, next, cameraSlug) {
		Camera.findOne({slug: cameraSlug}, function(err, camera){
			// if(err)
			if (camera) {
				req.camera = camera;
			} else {
				req.camera = null;
				// next(new Error('Camera not found'));
				// res.status(404).send('Camera "' + cameraSlug + '" not found');
			}
			next();
		});
	});

/*
	router.param("cameraId", function (req, res, next, cameraId) {
		Camera.findById(cameraId, function(err, camera){
			req.camera = camera ? camera : null;
			next();
		});
	});


	router.param("berthId", function (req, res, next, berthId) {
		Berth.findById(berthId, function(err, berth){
			req.berth = berth ? berth : null;
			next();
		});
	});
*/
// OK
	router.param("berthNumber", function (req, res, next, berthNumber) {
		Berth.findOne({number: berthNumber})
		.exec(function(err, berth){
			req.berth = berth ? berth : null;
			next();
		});
	});


	router.param("userId", function (req, res, next, userId) {
		User.findById(userId)
		.exec(function(err, user){
				req.userData = user ? user : null;
				next();
		});
	});


}
