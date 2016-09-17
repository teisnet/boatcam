'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: 'localhost',
	dialect: 'postgres',
	logging: console.log
});

let models = [
	'User',
	'Camera',
	'Berth',
	'BerthUser',
	'CameraPosition'    // Camera <-> Berth
];

let db = {};

models.forEach(function(modelName) {
		let model = sequelize.import(path.join(__dirname, modelName));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

sequelize.authenticate()
.then(() => sequelize.sync({ force: false }))
.then(() => console.log('Sync complete'))
.catch((err) => console.warn('Could not connect to database: ' + err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
