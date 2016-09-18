"use strict";

const models  = require('../../models');
const User = models.User;
var errorHandlers = require("./errorHandlers");

var objectIdRegex = new RegExp("^[0-9]+$");

// BERTHS

module.exports = function (router) {

	router.route('/users')
	// Get all
	.get(function(req, res, next) {
		User.findAll()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get users");
		});
	})
	// Create
	.post(function(req, res, next) {
		var changes = req.body;
		// find by document id and update
		User.build(changes)
		.save()
		.then((user) => {
			if (!user) return errorHandlers.error(res, null, "Could not create user");
			// 201 (Created)
			res.status(201).json(user);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not create user");
		});
	});


	router.route('/users/:userId')
	// Get one
	.get(function(req, res, next) {
		var userId = req.params.userId;

		// Check if userId refer to the 'id' field or the 'number' field
		var query = objectIdRegex.test(userId) ? { id: userId } : { slug: userId };

		User.findOne({
			where: query,
			include: [{ model: models.Berth, as: 'berths' }]
		})
		.then((user) => {
			if(!user) return errorHandlers.notFound(res, "User " + userId + " not found");
			res.json(user);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get user " + userId);
		});
	})
	// Update
	.put(function(req, res, next) {
		var userId = req.params.userId;
		var changes = req.body;

		var pw;
		if (changes.password) {
			var pw = changes.password;
		}

		// Outside if statement 'as password = ""'' will not pass the statement
		delete changes.password;

		User.findByIdAndUpdate(
			userId,
			{ $set:  changes}, // TODO: Set only schema fields
			{ new: true, runValidators: true }
		)
		//.select("+password")
		.exec()
		.then(function(user) {
			if (pw && user) {
				user.password = pw;
				return user.save();
			}
			return user;
		})
		.then(function(user) {
			if (!user) {
				errorHandlers.notFound(res, "User " + userId + " not found");
			} else {
				res.json(user);
			}
		})
		.catch(function (err) {
			errorHandlers.error(res, err, "Could not update user " + userId);
		});

	})
	// Delete
	.delete(function(req, res, next) {
		var userId = req.params.userId;
		User.findByIdAndRemove(
			userId,
			function(err) {
				if (err) return errorHandlers.error(res, err, "Could not delete user " + userId);
				res.sendStatus(200);
			}
		);
	});
}
