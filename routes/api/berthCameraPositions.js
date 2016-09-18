"use strict";

const models  = require('../../models');
const CameraPosition = models.CameraPosition;

module.exports = function (router) {

	// BERTH CAMERA POSITIONS
	router.route('/berths/:berthId/positions/:cameraId')

	.get(function(req, res){
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		CameraPosition.findOne({ where: {berth_id: berthId, camera_id: cameraId } })
		.then((berthCameraPosition) => {
			if(!berthCameraPosition) return handleNotFound(res, 'Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
			res.json(berthCameraPosition);
		})
		.catch((err) => {
			// handleError(res, err, "Could not get camera position for berth " + berthId + " and camera " + cameraId);
			res.status(400).send(err.message);
		});
	})

	/*
	.post(function(req, res) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		let newCameraPositionData = {camera: cameraId, berth: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom };

		CameraPosition.create(newCameraPositiobData)
		.then((cameraPosition) => {
			res.json({ message: 'Created camera position, berthId = ' + berthId + ", cameraId = " + cameraId });
		})
		.catch((err) => {
			// handleError(res, err, "Could not create camera position for berth " + berthId + " and camera " + cameraId);
		});
	})
	*/

	.put(function(req, res) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;

		CameraPosition.upsert(
			{ camera_id: cameraId, berth_id: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom },
			{ }
		)
		.then(function(result){
			return res.json({ message: 'Created or edited camera position, berthId = ' + berthId + ", cameraId = " + cameraId });
		})
		.catch((err) => {
			// handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
			res.status(400).send(err.message);
		});
	})

	.delete(function(req, res) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;

		CameraPosition.destroy({ where: { camera_id: cameraId, berth_id: berthId } })
		.then((result) => {
			res.json({ count: result, cameraId: cameraId, berthId: berthId });
		})
		.catch((err) => {
			res.status(400).send(err.message);
		})
	});

}
