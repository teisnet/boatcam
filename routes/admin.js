"use strict";

var express = require('express');
var router = express.Router();

var User = require("../models/user");
var Camera = require("../models/camera");
var Berth = require("../models/Berth");

var utils = require("./utils")(router);

router.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

router.get('/', function(req, res, next) {
    //res.redirect('admin/berths');
    res.render('admin/index', { user: req.user } );
});


router.get('/users', function(req, res, next) {
    User.find({}, function(err, users){
        res.render('admin/users', { title: req.app.locals.title, users: users});
    });
});


router.get('/users/new', function(req, res, next) {
    res.render('admin/user', { title: req.app.locals.title, userData: { new: true }});
});


router.get('/users/:userId', function(req, res, next) {
    let userId = req.params.userId;
    User.findById(userId)
    .exec(function(err, user){
		if (!user) {
			res.status(404).send('User "' + userId + '" not found');
			return;
		}
        res.render('admin/user', { title: user.name, userData: user});
    });
});


router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('admin/cameras', { title: req.app.locals.title, cameras: cameras});
    });
});


router.get("/cameras-list/:optional?", function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('admin/cameras-list', { title: req.app.locals.title, cameras: cameras });
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
		camera.populatePositions()
		.then(() => {
			res.render('admin/camera', { title: req.app.locals.title, camera: camera });
		})
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
    .exec(function(err, berth){
		if (!berth) {
			res.status(404).send('Berth "' + berthNumber + '" not found');
			return;
		}
		berth.populateCameraPositions()
		.then(() => {
			res.render('admin/berth', { title: req.app.locals.title, berth: berth });
		})
    });
});


module.exports = router;
