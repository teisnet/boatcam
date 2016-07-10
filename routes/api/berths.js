"use strict";

var errorHandlers = require("./errorHandlers");
var Berth = require("../../models/Berth");

module.exports = function (router) {

	// BERTHS

	router.route('/berths')
	// Get all
	.get(function(req, res, next) {
		Berth.find({}, function(err, berths){
			if (err) return errorHandlers.error(res, err, "Could not get berths");
			res.json(berths);
		});
	})
	// Create
	.post(function(req, res, next) {
		var changes = req.body;
		// find by document id and update
		var newBerth = new Berth(changes);
		newBerth.save(function(err, berth){
			if (err || !berth) return errorHandlers.error(res, err, "Could not create berth");
			// 201 (Created)
			res.status(201).json(berth);
		});
	});


	router.route('/berths/:berthId')
	// Get one
	.get(function(req, res, next) {
		var berthId = req.params.berthId;

		// Check if berthId refer to the '_id' field or the 'number' field
		var query = objectIdRegex.test(berthId) ? {_id: berthId} : {slug: berthId};

		Berth.findOne(query, function(err, berth){
			if (err) return errorHandlers.error(res, err, "Could not get berth " + berthId);
			if(!berth) return errorHandlers.notFound(res, "Berth " + berthId + " not found");

			res.json(berth);
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
