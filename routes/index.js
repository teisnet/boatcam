"use strict";

var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require("path");

var Camera = require("../models/Camera");
var Berth = require("../models/Berth");

router.get('/', function(req, res, next) {
    //res.redirect('/cameras');
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

router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('cameras', { title: req.app.locals.title, cameras: cameras });
    });
});


router.get('/cameras/:cameraSlug', function(req, res, next) {
  var cameraSlug = req.params.cameraSlug;

  Camera.findOne({slug: cameraSlug}, function(err, camera){
        if (!camera) {
            res.status(404).send('Camera "' + cameraSlug + '" not found');
            return;
        }
        res.render('camera', { title: camera.title, camera: camera });
    });
});

router.get('/cameras/:cameraSlug/ios', function(req, res, next) {
  var cameraSlug = req.params.cameraSlug;

  Camera.findOne({slug: cameraSlug}, function(err, camera){
        if (!camera) {
            res.status(404).send('Camera "' + cameraSlug + '" not found');
            return;
        }
        res.render('camera-ios',  { title: camera.title, camera: camera });
    });
});


module.exports = router;
