var db = require('./db');
var mongoose = require('mongoose');
var CameraPositionSchema = require('./schemas/CameraSchema');

module.exports = mongoose.model('CameraPosition', CameraPositionSchema);