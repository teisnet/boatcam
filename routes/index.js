var express = require('express');
var router = express.Router();

var Camera = require("../models/Camera");
var Berth = require("../models/Berth");


/* GET home page. */
router.get('/', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.render('cameras', { title: req.app.locals.title, cameras: cameras });
    });
    
  
});

/* GET home page. */
router.get('/cameras/:cameraName', function(req, res, next) {
  var cameraName = req.params.cameraName.toLowerCase();
  //var camera = req.app.locals.cameras[cameraName];
  Camera.findOne({name: cameraName}, function(err, camera){
        if (!camera) {
            res.status(404).send('Camera "' + cameraName + '" not found');
            return;
        }
        //res.render('cameras', { title: req.app.locals.title, cameras: cameras });
        res.render('camera', { title: camera.title, url: camera.uri, slug: camera.name.toLowerCase() });
    });
});


module.exports = router;
