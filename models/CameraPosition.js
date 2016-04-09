var db = require('./db');
var mongoose = require('mongoose');
var CameraPositionSchema = require('./schemas/CameraPositionSchema');

module.exports = mongoose.model('CameraPosition', CameraPositionSchema, 'camera_positions');
