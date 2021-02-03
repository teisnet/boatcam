'use strict';

const models  = require('../../models');
const Position = models.Position;
const BerthPosition = models.BerthPosition;

module.exports = function (router) {

	// BERTH <-> CAMERA: CAMERA POSITIONS
	router.route('/berths/:berthId/positions/:cameraId')

	.get((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;
		Position.findOne({
			where: { camera_id: cameraId },
			include: [{ model: models.Berth, as: "berths", where: { berth_id: berthId } }]
		})
		.then((position) => {
			if(!position) return res.sendStatus(404); // 404 Not Found
			res.json(position);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	.post((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;
		let position = null;
		Position.create({ camera_id: cameraId, x: req.body.x, y: req.body.y, zoom: req.body.zoom })
		.then((newPosition) => {
			position = newPosition;
			return BerthPosition.create({ berth_id: berthId, position_id: newPosition.id });
		})
		.then((berthPosition) => {
			res.json(position);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	/*
	.put((req, res) => {
		let berthId = req.params.berthId;
		let cameraId = req.params.cameraId;

		Camera.upsert(
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
	*/

	router.route(['/berths/:berthId/positions/:positionId', '/cameras/:cameraId/positions/:positionId'])
	.get((req, res) => {
		let berthId = req.params.berthId;
		let positionId = req.params.positionId;
		Position.findOne({ where: { id: positionId } })
		.then((position) => {
			res.json(position);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		})

	})
	.delete((req, res) => {
		let berthId = req.params.berthId;
		let positionId = req.params.positionId;

		// TODO: verify that position is associated with berthId/cameraId
		Position.destroy({ where: { id: positionId } })
		.then((result) => {
			res.json({ count: result, positionId: positionId, berthId: berthId });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		})
	});

}
