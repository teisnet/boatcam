"use strict";

var User = require("../../models/User");

var objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

// BERTHS

module.exports = function (router) {

	router.route('/users')
	// Get all
	.get(function(req, res, next) {
		User.find({}, function(err, users){
			if (err) return handleError(res, err, "Could not get users");
			res.json(users);
		});
	})
	// Create
	.post(function(req, res, next) {
		var changes = req.body;
		// find by document id and update
		var newUser = new User(changes);
		newUser.save(function(err, user){
			if (err || !user) return handleError(res, err, "Could not create user");
			// 201 (Created)
			res.status(201).json(user);
		});
	});


	router.route('/users/:userId')
	// Get one
	.get(function(req, res, next) {
		var userId = req.params.userId;

		// Check if userId refer to the '_id' field or the 'number' field
		var query = objectIdRegex.test(userId) ? {_id: userId} : {slug: userId};

		User.findOne(query, function(err, user){
			if (err) return handleError(res, err, "Could not get user " + userId);
			if(!user) return handleNotFound(res, "User " + userId + " not found");
			res.json(user);
		});
	})
	// Update
	.put(function(req, res, next) {
		var userId = req.params.userId;
		var changes = req.body;
		// find by document id and update
		User.findByIdAndUpdate(
			userId,
			{ $set:  changes}, // TODO: Set only schema fields
			{ new: true, runValidators: true },
			function(err, user) {
				if (err) return handleError(res, err, "Could not update user " + userId);
				if(!user) return handleNotFound(res, "User " + userId + " not found");
				res.json(user);
			}
		);
	})
	// Delete
	.delete(function(req, res, next) {
		var userId = req.params.userId;
		User.findByIdAndRemove(
			userId,
			function(err) {
				if (err) return handleError(res, err, "Could not delete user " + userId);
				res.sendStatus(200);
			}
		);
	});
}
