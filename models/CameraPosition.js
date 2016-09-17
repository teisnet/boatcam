'use strict';

module.exports = function(sequelize, DataTypes) {
	const ProjectUser = sequelize.define('CameraPosition', {
		x: DataTypes.REAL,
		y: DataTypes.REAL,
		zoom: DataTypes.REAL
	}, {
		//tableName: 'project_users',
		timestamps: false,
		// underscored: true,
		underscoredAll: true,
		// comment: 'I'm a table comment!'

	});

	return ProjectUser;
};
