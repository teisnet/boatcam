"use strict";

const models  = require('../../models');
const BerthUser = models.BerthUser;
const Berth = models.Berth;

module.exports = function (router) {

	// BERTH <-> USERS
	router.get('/users/:userId/berths', (req, res) => {
		var userId = req.params.userId;
		let promise;

		if (req.query.required === "false") {
			promise = Berth.getAllFlagUser(userId)
		} else {
			promise = Berth.findAll({
				include: [{ model: models.User, as: 'users', where: { id: userId } }]
			});
		};

		promise
		.then((berths) => {
			res.json(berths);
		})
		.catch((err) => {
			res.status(400).send(err.message);
		});
	});

	router.route(['/berths/:berthId/users/:userId', '/users/:userId/berths/:berthId'] )

	.get(function(req, res){
		var berthId = req.params.berthId;
		var userId = req.params.userId;
		BerthUser.findOne({ where: {berth_id: berthId, user_id: userId } })
		.then((berthUser) => {
			if(!berthUser) return handleNotFound(res, 'User id ' + userId + " with berth id " + berthId + " not found");
			res.json(berthUser);
		})
		.catch((err) => {
			// handleError(res, err, "Could not get camera position for berth " + berthId + " and camera " + cameraId);
			res.status(400).send(err.message);
		});
	})

	.post(function(req, res) {
		var berthId = req.params.berthId;
		var userId = req.params.userId;
		let newBerthUserData = { berth: berthId, user: userId };

		BerthUser.create(newBerthUserData)
		.then((berthUser) => {
			res.json({ message: 'Created Berth user, berthId = ' + berthId + ", userId = " + userId });
		})
		.catch((err) => {
			// handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
			res.status(400).send(err.message);
		});
	})

	/* PUT is not relevant since the joint table has no associated fields
	.put(function(req, res) {
		var berthId = req.params.berthId;
		var userId = req.params.userId;

		BerthUser.upsert(
			{ user_id: userId, berth_id: berthId },
			{ }
		)
		.then(function(result){
			return res.json({ message: 'Created or edited berth user, berthId = ' + berthId + ", userId = " + userId });
		})
		.catch((err) => {
			// res.send(500, { error: err });
			// handleError(res, err, "Could not save berth user " + berthId + " and user " + userId);
			res.status(400).send(err.message);
		});
	})
	*/

	.delete(function(req, res) {
		var berthId = req.params.berthId;
		var userId = req.params.userId;

		BerthUser.destroy({ where: { user_id: userId, berth_id: berthId } })
		.then((result) => {
			res.json({ count: result, user_id: userId, berthId: berthId });
		})
		.catch((err) => {
			res.status(400).send(err.message);
		})
	});

}
