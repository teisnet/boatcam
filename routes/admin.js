"use strict";

var express = require('express');
var router = express.Router();

var Camera = require("../models/camera");
var Berth = require("../models/Berth");


router.get('/', function(req, res, next) {
    //res.redirect('admin/berths');
    res.render('admin/index');
});


router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('admin/cameras', { title: req.app.locals.title, cameras: cameras });
    });
});


router.get('/cameras/new', function(req, res, next) {
    res.render('admin/camera', { title: req.app.locals.title, camera: { new: true, enabled: true } });
});


router.get('/cameras/:cameraSlug', function(req, res, next) {
    let cameraSlug = req.params.cameraSlug;
    Camera.findOne({slug: cameraSlug}, function(err, camera){
        if (!camera) {
            res.status(404).send('Camera "' + cameraSlug + '" not found');
            return;
        }
        res.render('admin/camera', { title: req.app.locals.title, camera: camera });
    });
});


router.get('/berths', function(req, res, next) {
    Berth.find({}, function(err, berths){
        res.render('admin/berths', { title: req.app.locals.title, berths: berths });
    });
});


router.get('/berths/new', function(req, res, next) {
    res.render('admin/berth', { title: req.app.locals.title, berth: { new: true } });
});


router.get('/berths/:berthNumber', function(req, res, next) {
    let berthNumber = req.params.berthNumber;
    Berth.findOne({number: berthNumber})
    .populate("positions.camera")
    .exec(function(err, berth){
        if (!berth) {
            res.status(404).send('Berth "' + berthNumber + '" not found');
            return;
        }
        res.render('admin/berth', { title: req.app.locals.title, berth: berth });
    });
});


module.exports = router;
