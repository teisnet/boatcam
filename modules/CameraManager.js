var CameraManager = {};

var  Cam = require('onvif').Cam;

new Cam({
  hostname: "192.168.1.112",
  username: "admin",
  password: "admin",
  port: "8080"
}, function(err, result) {
    if (err) { console.error("Could not initialize camera. (" + err.message + ")"); return; }
    console.log("Camera initialized.");
});

module.exports = CameraManager;