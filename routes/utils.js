"use strict";

const path = require("path");
const Camera = require("../models/Camera");
const Berth = require("../models/Berth");
const User = require("../models/User");


module.exports = function(router) {

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
