"use strict";

var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require("path");

var Camera = require("../models/Camera");


router.param("cameraSlug", function (req, res, next, cameraSlug) {
	Camera.findOne({slug: cameraSlug}, function(err, camera){
		// if(err)
		if (camera) {
			req.camera = camera;
		} else {
			req.camera = null;
			// next(new Error('Camera not found'));
			// res.status(404).send('Camera "' + cameraSlug + '" not found');
		}
		next();
	});
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


router.get('/cameras/:cameraSlug/bare', function(req, res, next) {
  var cameraSlug = req.params.cameraSlug;
  var camera = req.camera;

  if (!camera) {
      res.status(404).send('Camera "' + cameraSlug + '" not found');
      return;
  }
  res.render('camera-bare',  { title: camera.title, camera: camera});

});


module.exports = router;
