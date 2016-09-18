"use strict";

const models  = require('../../models');
const Berth = models.Berth;
var errorHandlers = require("./errorHandlers");

module.exports = function (router) {

	// BERTHS

	router.route('/berths')
	// Get all
	.get(function(req, res, next) {
		Berth.findAll()
		.then((berths) => {
			res.json(berths);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get berths");
		});
	})
	// Create
	.post(function(req, res, next) {
		var changes = req.body;
		// find by document id and update
		Berth.build(changes)
		.save()
		.then((berth) => {
			if (!berth) return errorHandlers.error(res, null, "Could not create berth");
			// 201 (Created)
			res.status(201).json(berth);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not create berth");
		});
	});


	var objectIdRegex = new RegExp("^[0-9]+$");

	router.route('/berths/:berthId')
	// Get one
	.get(function(req, res, next) {
		var berthId = req.params.berthId;

		// Check if berthId refer to the 'id' field or the 'number' field
		// var query = objectIdRegex.test(berthId) ? {id: berthId} : {number: berthId};
		var query = { number: berthId };

		Berth.findOne({
			where: query,
			include: [{ model: models.Camera, as: 'cameras' }, { model: models.User, as: 'users' }]
		})
		.then((berth) => {
			if(!berth) return errorHandlers.notFound(res, "Berth " + berthId + " not found");
			res.json(berth);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not get berth " + berthId);
		});
	})
	// Update
	.put(function(req, res, next) {
		var berthId = req.params.berthId;
		var changes = req.body;
		// find by document id and update
		Berth.findByIdAndUpdate(
			berthId,
			{ $set:  changes}, // TODO: Set only schema fields
			{ new: true, runValidators: true },
			function(err, berth) {
				if (err) return errorHandlers.error(res, err, "Could not update berth " + berthId);
				if(!berth) return errorHandlers.notFound(res, "Berth " + berthId + " not found");
				res.json(berth);
			}
		);
	})
	// Delete
	.delete(function(req, res, next) {
		var berthId = req.params.berthId;
		Berth.findByIdAndRemove(
			berthId,
			function(err) {
				if (err) return errorHandlers.error(res, err, "Could not delete berth " + berthId);
				res.sendStatus(200);
			}
		);
	});
}
