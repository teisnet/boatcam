var Camera = require("../models/Camera");

var camerasData = require("../config.json").cameras;

for (var cameraField in camerasData) {
   if (camerasData.hasOwnProperty(cameraField)) {
      createCamera(camerasData[cameraField]);
   }
}

function createCamera(cameraData) {
    
    console.log("New camera: name " + cameraData.name + ", title: " + cameraData.title + ", url: " + cameraData.url);
    
    /*   
    var newCamera = new Camera({name: cameraData.name, title: cameraData.title, uri: cameraData.url });
    
    newCamera.save(function (err, cam) {
        if (err) {
            console.error("Error creating camera (" + err + ")");
            return console.error(err);
        }
        console.log("Saved");
    });
    */
}


