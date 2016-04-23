"use strict";

var express = require('express');
var router = express.Router();

require('./cameras')(router);
require('./berths')(router);
require('./berthCameraPositions')(router);

module.exports = router;
