"use strict";

var express = require('express');
var router = express.Router();

require('./users')(router);
require('./cameras')(router);
require('./berths')(router);
require('./berthCameraPositions')(router);

module.exports = router;
