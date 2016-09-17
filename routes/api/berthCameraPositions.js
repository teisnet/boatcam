"use strict";

const models  = require('../../models');
const CameraPosition = models.CameraPosition;

module.exports = function (router) {

	// BERTH CAMERA POSITIONS
	router.route('/berths/:berthId/positions/:cameraId')

	.get(function(req, res, next){
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		CameraPosition.find({ where: {berth_id: berthId, camera_id: cameraId}})
		.then((berthCameraPositions) => {
			// TODO: consider returning empty array in subobject
			// TODO: Handle arrays when multiple values found
			// TODO: Fix handleNotFound not defined
			if(!berthCameraPositions) return handleNotFound(res, 'Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
			res.json(berthCameraPositions);
		})
		/*.catch((err) => {
			handleError(res, err, "Could not get position for berth " + berthId + " and camera " + cameraId);
		});*/
	})

	// Not tested
	.post(function(req, res, next) {
		var berthId = req.params.berthId;
		var cameraId = req.params.cameraId;
		var berthCameraPosition = CameraPosition.build({camera: cameraId, berth: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom });

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

		CameraPosition.upsert(
			{ camera_id: cameraId, berth_id: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom },
			{ }
		)
		.then(function(result, more){
			return res.json({ message: 'Created Berth position, berthId = ' + berthId});
		})
		.catch((err) => {
			res.send(500, { error: err });
			// handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
		});
	});

	router.route(['/berths/positions/:cameraPositionId', '/cameras/positions/:cameraPositionId'])
	.delete(function() {
		var cameraPositionId = req.params.cameraPositionId;
		CameraPosition.findById(cameraPositionId, function(err, doc){
			doc.remove(function(err, doc){
				res.json({id: cameraPositionId}); // OK
			});
		});
	});

}
