'use strict';

const IpCamera = require('../modules/Camera');

const EventEmitter = require('events');
const cameraEmitter = new EventEmitter();

module.exports = function(sequelize, DataTypes) {
	const Camera = sequelize.define('Camera', {
		enabled: DataTypes.BOOLEAN,
		// Lowercase, no danish letters. Used for urls and logging. 'ostrebassin'
		slug: {
			type: DataTypes.STRING,
			// lowercase: true,
			// trim: true,
			allowNull: false,
			unique : true,
			validate: {
				is: {
					args: /^[a-z][a-z0-9-_]*$/,
					msg: 'Value must only contain English lowercase characters and numbers'
				},
				not: {
					args: /^[0-9a-fA-F]{24}$/,
					msg: 'Value cannot be an ObjectId'
				}
			}
		},
		title: DataTypes.STRING,
		uri: DataTypes.STRING,
		hostname: DataTypes.STRING,
		onvif: DataTypes.INTEGER,
		http: DataTypes.INTEGER,
		username: DataTypes.STRING, // TODO: Trim
		password: DataTypes.STRING  // TODO: Trim
	}, {
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				Camera.belongsToMany(models.Berth, { through: models.CameraPosition, as: 'berths', foreignKey: 'camera_id' });
			}
		}
	});

	return Camera;
};
