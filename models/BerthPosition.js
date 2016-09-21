'use strict';

module.exports = function(sequelize, DataTypes) {
	const BerthPosition = sequelize.define('BerthPosition', {

	}, {
		timestamps: false,
		underscoredAll: true
	});

	return BerthPosition;
};
