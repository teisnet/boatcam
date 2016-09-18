'use strict';

const EventEmitter = require('events');
const cameraEmitter = new EventEmitter();
const IpCamera = require('../modules/Camera');

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
			move(command) {
				this._camera.move(command);
			},

			moveTo(pos) {
				this._camera.moveTo(pos);
			},

			snapshot(err, cb) {
				this._camera.snapshot(err, cb);
			},

			onMove(handler) {
				this._camera.on('move', handler);
			},

			onStatus(handler) {
				this._camera.on('status', handler);
			}
		},

		getterMethods: {
			name() { return this.slug; },

			position() {
				return this._camera ? this._camera.position : {x: 0, y: 0, zoom: 1.0};
			},

			online() {
				return this._camera ? this._camera.online : false;
			},

			status() {
				return this._camera ? this._camera.status : 'disabled';
			}
		},

		hooks: {
			// Avaliable hooks (http://docs.sequelizejs.com/en/latest/docs/hooks/):
			// 1) beforeBulk: Create, Destroy, Update
			// 2) beforeVaidate, afterValidate, validationFailed
			// 3) before:     Create, Destroy, Update, Save, Upsert
			// 4) after:      Create, Destroy, Update, Save, Upsert
			// 5) afterBulk:  Create, Destroy, Update
			//
			// More:
			// beforeBulk:    Restore, Sync
			// before:        Restore, Sync, Define, Init, Find, FindAfterExpandIncludeAll, FindAfterOptions
			// after:         Restore, Sync, Define, Init, Find
			// afterBulk:     Restore, Sync

			// Create
			beforeBulkCreate(cameras, options) {
				options.individualHooks = true;
			},

			afterCreate(camera, options) {
				camera._camera = new IpCamera(camera);
				cameraEmitter.emit('new', camera);
				return camera;
			},

			// Update
			beforeBulkUpdate(options) {
				options.individualHooks = true;
			},

			afterUpdate(camera, options) {
				IpCamera.get(camera.id).config(camera);
				return camera;
			},

			// Find
			afterFind(cameras, options){
				if(cameras.constructor === Array) {
					cameras.forEach((camera) => initCamera(camera));
				} else {
					initCamera(cameras);
				}

				function initCamera(camera) {
					camera._camera = IpCamera.get(camera.id);
					if (!camera._camera) {
						camera._camera = new IpCamera(camera);
						cameraEmitter.emit('new', camera);
					}
				}
				return cameras;
			},

			// Delete
			beforeBulkDestroy(options) {
				options.individualHooks = true;
			},

			beforeDestroy(camera, options) {
				IpCamera.get(camera.id) && IpCamera.get(camera.id).remove();
				cameraEmitter.emit('removed', camera);
			}
		}
	});

	return Camera;
};
