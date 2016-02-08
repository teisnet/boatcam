var db = require('./db');
var mongoose = require('mongoose');
var CameraSchema = require('./schemas/CameraSchema');

module.exports = mongoose.model('Camera', CameraSchema);