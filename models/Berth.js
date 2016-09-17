'use strict';

module.exports = function(sequelize, DataTypes) {
	var Berth = sequelize.define('Berth', {
		number: {
			type:  DataTypes.STRING,
			// trim: true,
			allowNull: false,
			unique : true,
			validate: {
				is: {
					args: /^[a-z0-9-_.]*$/i,
					msg: 'Value must only contain English characters and numbers'
				},
				not: {
					args: /^[0-9a-fA-F]{24}$/,
					msg: 'Value cannot be an ObjectId'
				}
			}
		},
		owner: DataTypes.STRING
	}, {
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				Berth.belongsToMany(models.Camera, { through: models.CameraPosition, as: 'cameras', foreignKey: 'berth_id' });
				Berth.belongsToMany(models.User, { through: models.BerthUser, as: 'users', foreignKey: 'berth_id' });
			}
		}
	});

	return Berth;
};
