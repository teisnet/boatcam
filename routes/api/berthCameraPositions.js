"use strict";

var CameraPosition = require("../../models/CameraPosition");

module.exports = function (router) {

	// BERTH CAMERA POSITIONS
	router.route('/berths/:berthId/positions/:cameraId')

	.get(function(req, res, next){
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		CameraPosition.find({berth: berthId, camera: cameraId})
		.exec()
		.then((berthCameraPositions) => {
			// TODO: consider returning empty array in subobject
			if(!berthCameraPositions) return handleNotFound(res, 'Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
			res.json(berthCameraPositions[0]);
		})
		/*.catch((err) => {
			handleError(res, err, "Could not get position for berth " + berthId + " and camera " + cameraId);
		});*/
	})

	.post(function(req, res, next) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		var berthCameraPosition = new CameraPosition({camera: cameraId, berth: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom });

		berthCameraPosition.save()
		.then((berth) => {
			res.json({ message: 'Created Berth position, berthId = ' + berthId});
		})
		/*.catch((err) => {
			handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
		});*/
	})

	.put(function(req, res, next) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;

		CameraPosition.findOneAndUpdate(
			{ camera: cameraId, berth: berthId },
			{ $set: { x: req.body.x, y: req.body.y, zoom: req.body.zoom } },
			{ upsert: true },
			function(err, doc){
				if (err) return res.send(500, { error: err });
				return res.json({ message: 'Created Berth position, berthId = ' + berthId});
			});
		/*.catch((err) => {
			handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
		});*/
	})

	.delete(function() {
		var cameraPositionId = req.params.cameraPositionId;
		CameraPosition.findById(cameraPositionId, function(err, doc){
			doc.remove(function(err, doc){
				res.json({_id: cameraPositionId}); // OK
			});
		});
	});

}
