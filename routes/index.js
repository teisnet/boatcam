"use strict";

var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require("path");


router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/snapshots/:filename', function(req, res, next) {
	let snapshotFilename = req.params.filename;
	fs.readFile(path.join('./files/', snapshotFilename), function(err, data) {
		if (err) {
			res.status(404).send('Snapshot "' + snapshotFilename + '" not found');
			return;
		}
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.end(data);
	});
});


module.exports = router;
