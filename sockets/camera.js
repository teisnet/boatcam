"use strict";

const Camera = require("../models/Camera");

module.exports = function(io){

    const camerasNamespace = io.of("/cameras");
    camerasNamespace.on("connection", function(socket){
        Camera.find({}, function(err, cameras){
            let status = cameras.map(function(camera){
                    let cameraStatus = camera.status;
                    cameraStatus._id = camera._id;
                    return cameraStatus;
                });
            camerasNamespace.emit("status", status);
        });

    });

    Camera.find({}, function(err, cameras){
        cameras.map(function(camera){

            let cameraSlug = camera.name;

            let cameraNamespace = io.of("/cameras/" + cameraSlug);

            camera.onMove( (position) => cameraNamespace.emit("move", position) );

            camera.onStatus( (status) => {
                status._id = camera._id;
                cameraNamespace.emit("status", status);
                camerasNamespace.emit("status", status);
            } );

            cameraNamespace.on("connection", function(socket){

                console.log("Sockets: " + cameraSlug + ".connection");

                socket.emit("move", camera.position );
                socket.emit("status", camera.status );

                socket.on("move", (command) => camera.move(command) );
                socket.on("moveto", (pos) => camera.moveTo(pos) );

                socket.on("snapshot", (data, cb) => {
                    camera.snapshot( (err, result) => {
                        cb(result);
                    } );
                } );

                socket.on("disconnect", () => console.log("Sockets: " + cameraSlug + ".disconnect") );
            });
        });
    });
}
