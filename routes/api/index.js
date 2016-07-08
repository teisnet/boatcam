"use strict";

var express = require('express');
var router = express.Router();

/*
router.use(function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401);
});
*/

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
	next();
});

router.use(function (req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	// ? meta(http-equiv='Pragma', content='no-cache')
	// ? meta(http-equiv='Expires', content='-1')
	next();
});


require('./berthUsers')(router);
require('./users')(router);
require('./cameras')(router);
require('./berths')(router);
require('./berthCameraPositions')(router);

module.exports = router;
