'use strict';

module.exports = function(sequelize, DataTypes) {
	const Position = sequelize.define('Position', {
		x: DataTypes.REAL,
		y: DataTypes.REAL,
		zoom: DataTypes.REAL
	}, {
		timestamps: false,
		underscoredAll: true,
		classMethods: {
			associate(models) {
				Position.belongsToMany(models.Berth, { through: models.BerthPosition, as: 'berths', foreignKey: 'position_id' });
				Position.belongsTo(models.Camera, { as: 'camera', foreignKey: 'camera_id' });
			}
		}
	});

	return Position;
};
