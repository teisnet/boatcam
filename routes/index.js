"use strict";

var express = require('express');
var router = express.Router();
var passport = require("passport");

var fs = require('fs');
var path = require("path");

var Camera = require("../models/Camera");
var Berth = require("../models/Berth");


router.route('/login')
.get(function(req, res){
   res.render('login', { title: req.app.locals.title, message: req.flash('message') });
})
.post(
    passport.authenticate('local' , { failureFlash: true, failureRedirect: '/login'/*, successRedirect: '/'*/}),
    function(req, res) {
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    //delete req.session;
    //res.clearCookie('cookiename');
    res.redirect('/login');
});


var utils = require("./utils")(router);

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

router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('cameras', { title: req.app.locals.title, cameras: cameras});
    });
});


router.get('/cameras/:cameraSlug', function(req, res, next) {
  let cameraSlug = req.params.cameraSlug;
  let camera = req.camera;

  if (!camera) {
        res.status(404).send('Camera "' + cameraSlug + '" not found');
        return;
  }
  res.render('camera', { title: camera.title, camera: camera});
});


router.get('/profile', function(req, res, next) {
    res.render('profile', { title: req.user.name});
});


module.exports = router;
