"use strict";

const models  = require('../../models');
const Camera = models.Camera;
var errorHandlers = require("./errorHandlers");

module.exports = function (router) {

	// CAMERAS
	router.route('/cameras')
	// Get all
	.get(function(req, res, next) {
		Camera.findAll()
		.then((cameras) => {
			res.json(cameras);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get cameras");
		});
	})
	// Create
	.post(function(req, res, next) {
		var newCameraParams = req.body;
		// find by document id and update
		Camera.build(newCameraParams)
		.save()
		.then((camera) => {
			if (!camera) return errorHandlers.error(res, err, "Could not create camera");
			// 201 (Created)
			res.status(201).json(camera);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not create camera");
		});
	})


	var objectIdRegex = new RegExp("^[0-9]+$");

	router.route('/cameras/:cameraId')
	// Get one
	.get(function(req, res, next) {
		var cameraId = req.params.cameraId;

		// Check if cameraId refer to the 'id' field or the 'slug' field
		var query = objectIdRegex.test(cameraId) ? { id: cameraId } : { slug: cameraId };

		Camera.findOne({ where: query, include: [{ model: models.Berth, as: 'berths' }] })
		.then((camera) => {
			if(!camera) return errorHandlers.notFound(res, "Camera " + cameraId + " not found");
			res.json(camera);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get camera " + cameraId);
		});
	})
	// Update
	.put(function(req, res, next) {
		var cameraId = req.params.cameraId;
		var changes = req.body;
		// find by document id and update
		Camera.findByIdAndUpdate(
			cameraId,
			{ $set:  changes},
			{ new: true, runValidators: true },
			function(err, camera) {
				if (err) return errorHandlers.error(res, err, "Could not update camera " + cameraId);
				if(!camera) return errorHandlers.notFound(res, "Camera " + cameraId + " not found");
				// TODO: Update camera instance accordingly
				res.json(camera);
			}
		);
	})
	// Delete
	.delete(function(req, res, next) {
		var cameraId = req.params.cameraId;
		Camera.findByIdAndRemove(
			cameraId,
			function(err) {
				if (err) return errorHandlers.error(res, err, "Could not delete camera " + cameraId);
				res.sendStatus(200);
			}
		);
	});
}
