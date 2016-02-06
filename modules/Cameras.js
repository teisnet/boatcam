var Camera = require("../models/Camera");
var IpCamera = require("./Camera");


var Cameras = [];


Camera.find({}, function(err, _cameras){

    if (err) { console.error("Could not find cameras. (" + err.message + ")"); return; }

    _cameras.map(function(camera){
        //Cameras[camera._id] = new Camera(camera);
        Cameras.push(new IpCamera(camera));
    });
});


module.exports = Cameras;
