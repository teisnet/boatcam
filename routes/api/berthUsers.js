"use strict";

const models  = require('../../models');
const Berth = models.Berth;
const BerthUser = models.BerthUser;

module.exports = function (router) {

	router.route('/users/:userId/berths')
	.get(function(req, res, next){
		var userId = req.params.userId;
		BerthUser.find({ user: userId })
		.exec()
		.then((berthUsers) => {
			// TODO: consider returning empty array in subobject
			if(!berthUsers) return handleNotFound(res, 'Berth id ' + berthId + " with user id " + userId + " not found");
			res.json(berthUsers);
		})
		/*.catch((err) => {
			handleError(res, err, "Could not get position for berth " + berthId + " and camera " + cameraId);
		});*/
	});

	router.route('/berths/:berthId/users')
	.get(function(req, res, next){
		var berthId = req.params.berthId;
		BerthUser.find({ berth: berthId })
		.exec()
		.then((berthUsers) => {
			// TODO: consider returning empty array in subobject
			if(!berthUsers) return handleNotFound(res, 'Berth id ' + berthId + " with user id " + userId + " not found");
			res.json(berthUsers);
		})
		/*.catch((err) => {
			handleError(res, err, "Could not get position for berth " + berthId + " and camera " + cameraId);
		});*/
	});

	// BERTH CAMERA POSITIONS
	router.route(['/berths/:berthId/users/:userId', '/users/:userId/berths/:berthId'] )
	.post(function(req, res, next) {
		var berthId = req.params.berthId;
		var userId = req.params.userId;
		var berthUser = new BerthUser({ berth: berthId, user: userId });

		BerthUser.save()
		.then((berthUser) => {
			res.json({ message: 'Created Berth user, berthId = ' + berthId + ", userId = " + userId });
		})
		/*.catch((err) => {
			handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
		});*/
	});


	router.route(['/berths/users/:berthUserId', '/users/berths/:berthUserId'] )
	.delete(function() {
		var berthUserId = req.params.berthUserId;
		BerthUser.findById(berthUserId, function(err, doc){
			doc.remove(function(err, doc){
				res.json({id: berthUserId}); // OK
			});
		});
	});


	router.route('/users/berths')
	.get(function(req, res, next) {
		User.findAll({ include: [models.Berth] })
		.then( users => {
			res.json(users);
		})
		.catch( error => {
			console.error(error);
		})
	});

}
