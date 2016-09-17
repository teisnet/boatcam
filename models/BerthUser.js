'use strict';

module.exports = function(sequelize, DataTypes) {
	const BerthUser = sequelize.define('BerthUser', {

	}, {
		timestamps: false,
		// underscored: true,
		underscoredAll: true,
	});

	return BerthUser;
};
