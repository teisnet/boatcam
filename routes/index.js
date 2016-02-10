var express = require('express');
var router = express.Router();

var Camera = require("../models/Camera");
var Berth = require("../models/Berth");


router.get('/', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('cameras', { title: req.app.locals.title, cameras: cameras });
    });
});


router.get('/cameras/:cameraName', function(req, res, next) {
  var cameraName = req.params.cameraName.toLowerCase();

  Camera.findOne({name: cameraName}, function(err, camera){
        if (!camera) {
            res.status(404).send('Camera "' + cameraName + '" not found');
            return;
        }
        res.render('camera', { title: camera.title, camera: camera });
    });
});


module.exports = router;
