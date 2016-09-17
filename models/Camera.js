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
			},

			on: function(event, cb) {
				cameraEmitter.on(event, cb);
			}
		},

		instanceMethods: {
			move: function (command) {
				this._camera.move(command);
			},

			moveTo: function (pos) {
				this._camera.moveTo(pos);
			},

			snapshot: function (err, cb) {
				this._camera.snapshot(err, cb);
			},

			onMove: function (handler) {
				this._camera.on('move', handler);
			},

			onStatus: function (handler) {
				this._camera.on('status', handler);
			}

		},

		getterMethods: {
			name: function () { return this.slug; },
			position: function () {
				return this._camera ? this._camera.position : {x: 0, y: 0, zoom: 1.0};
			},
			online: function () {
				return this._camera ? this._camera.online : false;
			},

			status: function () {
				return this._camera ? this._camera.status : 'disabled';
			}
		},

		hooks: {

			afterFind: function(cameras, options/*, cb*/){
				if(cameras.constructor === Array) {
						let arrayLength = cameras.length;
						for (let i = 0; i < arrayLength; i++) {
							let camera = cameras[i];
							camera._camera = IpCamera.get(camera.id);
							if (!camera._camera) {
								camera._camera = new IpCamera(camera);
								// Emit 'new' from 'Camera' model
								cameraEmitter.emit('new', camera);
							} else {
								camera._camera.config(camera);
							}
						}
				} else {
				}
				//fn();
				return cameras;
			},

			delete: function(camera, options) {
				camera._camera = IpCamera.get(camera.id);
				if (camera._camera) {
					camera._camera.remove();
					delete camera._camera;
					// Emit 'remove' from 'Camera' model
					//cameraEmitter.emit('removed', camera);
				}
			}
		}
	});

	return Camera;
};
