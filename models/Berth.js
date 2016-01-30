var db = require('../database');
var mongoose = require('mongoose');
var BerthSchema = require('./schemas/BerthSchema');

module.exports = mongoose.model('Berth', BerthSchema);