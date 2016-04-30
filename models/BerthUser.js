"use strict";

var db = require('./db');
var mongoose = require('mongoose');
var BerthUserSchema = require('./schemas/BerthUserSchema');

module.exports = mongoose.model('BerthUser', BerthUserSchema, 'berth_users');
