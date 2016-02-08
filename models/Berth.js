var db = require('./db');
var mongoose = require('mongoose');
var BerthSchema = require('./schemas/BerthSchema');

module.exports = mongoose.model('Berth', BerthSchema);