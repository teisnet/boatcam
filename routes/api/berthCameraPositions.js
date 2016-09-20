'use strict';

const models  = require('../../models');
const CameraPosition = models.CameraPosition;

module.exports = function (router) {

	// BERTH <-> CAMERA: CAMERA POSITIONS
	router.route('/berths/:berthId/positions/:cameraId')

	.get((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;
		CameraPosition.findOne({ where: {berth_id: berthId, camera_id: cameraId } })
		.then((berthCameraPosition) => {
			if(!berthCameraPosition) return res.sendStatus(404); // 404 Not Found
			res.json(berthCameraPosition);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	/*
	.post((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;
		let newCameraPositionData = { camera: cameraId, berth: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom };

		CameraPosition.create(newCameraPositiobData)
		.then((cameraPosition) => {
			res.json({ message: `Created camera position, berthId = ${berthId}, cameraId = ${cameraId}` });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})
	*/

	.put((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;

		CameraPosition.upsert(
			{ camera_id: cameraId, berth_id: berthId, x: req.body.x, y: req.body.y, zoom: req.body.zoom },
			{ }
		)
		.then((result) => {
			return res.json({ message: `Created or edited camera position, berthId = ${berthId}, cameraId = ${cameraId}` });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	.delete((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;

		CameraPosition.destroy({ where: { camera_id: cameraId, berth_id: berthId } })
		.then((result) => {
			res.json({ count: result, cameraId: cameraId, berthId: berthId });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		})
	});

}
