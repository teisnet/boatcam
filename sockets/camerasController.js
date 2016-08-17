"use strict";

const Camera = require("../models/Camera");

module.exports = function(io){

	const camerasNamespace = io.of("/cameras");

	// Forward Camera.onStatus to socket connections
	// TODO: Make global "status" event on Camera class
	// TODO: Consider including id in camera status.
	Camera.on("new", cameraStatusHandler);
	Camera.find({}, function(err, cameras){
		cameras.forEach(cameraStatusHandler);
	});

	function cameraStatusHandler(camera) {
		camera.onStatus( (status) => {
			status._id = camera._id;
			camerasNamespace.emit("status", status);
		} );
	}

	camerasNamespace.on("connection", function(socket){

		// Each time a client connects send an array of all the camera statuses.
		Camera.find({}, function(err, cameras){
			// Add the id to each camera status
			let status = cameras.map(function(camera){
					let cameraStatus = camera.status;
					cameraStatus._id = camera._id;
					return cameraStatus;
				});

			camerasNamespace.emit("status", status);
		});

	});

}
