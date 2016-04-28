"use strict";

var path = require("path");
var Camera = require("../models/Camera");
var Berth = require("../models/Berth");


module.exports = function(router) {

	function hasRoute(value) {
		let length = router.stack.length;
		for (var i = 0; i < length; i++) {
			var route = router.stack[i];
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


	router.param("berthNumber", function (req, res, next, berthNumber) {
		Berth.findOne({number: berthNumber})
		.exec(function(err, berth){
			req.berth = berth ? berth : null;
			next();
		});
	});


}
