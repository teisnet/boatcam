var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cameras', { title: req.app.locals.title });
});

/* GET home page. */
router.get('/cameras/:cameraName', function(req, res, next) {
  var cameraName = req.params.cameraName.toLowerCase();
  var camera = req.app.locals.cameras[cameraName];
  res.render('camera', { title: camera.title, url: camera.url });
});

module.exports = router;
