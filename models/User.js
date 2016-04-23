var db = require('./db');
var mongoose = require('mongoose');
var UserSchema = require('./schemas/UserSchema');

module.exports = mongoose.model('User', UserSchema);
