var express = require('express');
var router = express.Router();

var cameras = {
    havn: {
        title: "Havn",
        name: "havn",
        url: "rtmp://192.168.1.36:5119/HavneCam"
    },
    minkalv1: {
        title: "Min Kalv 1",
        name: "minkalv1",
        url: "rtmp://192.168.1.36:5119/MinKalv1"
    },
    minkalv2: {
        title: "Min Kalv 2",
        name: "minkalv2",
        url: "rtmp://192.168.1.36:5119/MinKalv2"
    },
    minkalv3: {
        title: "Min Kalv 3",
        name: "minkalv3",
        url: "rtmp://192.168.1.36:5119/MinKalv3"
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cameras', { title: 'Kameraer', cameras: cameras });
});

/* GET home page. */
router.get('/cameras/:cameraName', function(req, res, next) {
  var cameraName = req.params.cameraName.toLowerCase();
  var camera = cameras[cameraName];
  res.render('camera', { title: camera.name, url: camera.url });
});

module.exports = router;
