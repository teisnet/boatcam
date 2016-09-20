'use strict';

const models  = require('../../models');
const BerthUser = models.BerthUser;
const Berth = models.Berth;
const User = models.User;

module.exports = function (router) {

	// BERTH <-> USERS

	// Get all berths and flag those related to the user
	router.get('/users/:userId/berths', (req, res) => {
		let userId = req.params.userId;
		let promise;

		if (req.query.required === 'false') {
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

	// Get all users and flag those related to the berth
	router.get('/berths/:berthId/users', (req, res) => {
		let berthId = req.params.berthId;
		let promise;

		if (req.query.required === 'false') {
			promise = User.getAllFlagBerth(berthId)
		} else {
			promise = User.findAll({
				include: [{ model: models.Berth, as: 'berths', where: { id: berthId } }]
			});
		};

		promise
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	});

	router.route(['/berths/:berthId/users/:userId', '/users/:userId/berths/:berthId'] )

	.get((req, res) => {
		let berthId = req.params.berthId;
		let userId = req.params.userId;
		BerthUser.findOne({ where: {berth_id: berthId, user_id: userId } })
		.then((berthUser) => {
			if(!berthUser) return res.sendStatus(404); // 404 Not Found
			res.json(berthUser);
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	.post((req, res) => {
		let berthId = req.params.berthId;
		let userId = req.params.userId;
		let newBerthUserData = { berth_id: berthId, user_id: userId };

		BerthUser.create(newBerthUserData)
		.then((berthUser) => {
			res.json({ message: 'Created Berth user, berthId = ' + berthId + ", userId = " + userId });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})

	/* PUT is not relevant since the joint table has no associated fields
	.put((req, res) => {
		let berthId = req.params.berthId;
		let userId = req.params.userId;

		BerthUser.upsert(
			{ user_id: userId, berth_id: berthId },
			{ }
		)
		.then((result) => {
			return res.json({ message: 'Created or edited berth user, berthId = ' + berthId + ", userId = " + userId });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		});
	})
	*/

	.delete((req, res) => {
		let berthId = req.params.berthId;
		let userId = req.params.userId;

		BerthUser.destroy({ where: { user_id: userId, berth_id: berthId } })
		.then((result) => {
			res.json({ count: result, user_id: userId, berthId: berthId });
		})
		.catch((err) => {
			res.status(400).send(err.message); // 400 Bad request
		})
	});

}
