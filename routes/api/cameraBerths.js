'use strict';

const models  = require('../../models');
const Berth = models.Berth;

module.exports = function (router) {

// CAMERA <-> BERTH (THROUGH POSITION)
	router.route('/cameras/:cameraId/berths')

	.get((req, res) => {
		let cameraId = req.params.cameraId;
		Berth.findAll({
			include: [{
				model: models.Position,
				as: 'positions',
				where: { camera_id: cameraId },
				required: false
			}]
		})
		.then((berths) => {
			res.json(berths);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});

	});
}
