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
		var newBerthData = req.body;
		Berth.create(newBerthData)
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
			include: [
				{ model: models.Position, as: 'positions', include: [{ model: models.Camera, as: 'camera' }] },
				{ model: models.User, as: 'users' }
			]
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
		Berth.update(changes, { where: { id: berthId }, returning: true })
		.then((result) => {
			let berth = result[1][0];
			if(!berth) return errorHandlers.notFound(res, "Berth " + berthId + " not found");
			res.json(berth);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not update berth " + berthId);
		});
	})
	// Delete
	.delete(function(req, res, next) {
		var berthId = req.params.berthId;
		Berth.destroy({ where: { id: berthId } })
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			errorHandlers.error(res, err, "Could not delete berth " + berthId);
		});
	});
}
