"use strict";

var express = require('express');
var router = express.Router();

var Camera = require("../models/camera");
var Berth = require("../models/Berth");


router.get('/', function(req, res, next) {
    res.redirect('admin/berths');
});


router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('admin/cameras', { title: req.app.locals.title, cameras: cameras });
    });
});


router.get('/cameras/new', function(req, res, next) {
    res.render('admin/newCamera', { title: req.app.locals.title });
});


router.get('/cameras/:cameraName', function(req, res, next) {
    let cameraName = req.params.cameraName;
    Camera.findOne({name: cameraName}, function(err, camera){
        // TODO: 404
        res.render('admin/camera', { title: req.app.locals.title, camera: camera });
    });
});


router.get('/berths', function(req, res, next) {
    Berth.find({}, function(err, berths){
        res.render('admin/berths', { title: req.app.locals.title, berths: berths });
    });
});


router.get('/berths/new', function(req, res, next) {
    res.render('admin/newBerth', { title: req.app.locals.title });
});


router.get('/berths/:berthNumber', function(req, res, next) {
    let berthNumber = req.params.berthNumber;
    Berth.findOne({number: berthNumber}, function(err, berth){
        // TODO: 404
        res.render('admin/berth', { title: req.app.locals.title, berth: berth });
    });
});


module.exports = router;
