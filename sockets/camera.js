"use strict";

const Camera = require("../models/Camera");

module.exports = function(io){

    const camerasNamespace = io.of("/cameras");
    camerasNamespace.on("connection", function(socket){
        Camera.find({}, function(err, cameras){
            let status = cameras.map(function(camera){
                    return {id: camera._id, value: camera.online};
                });
            camerasNamespace.emit("online", status);
        });

    });

    Camera.find({}, function(err, cameras){
        cameras.map(function(camera){

            let cameraSlug = camera.name.toLowerCase();

            let cameraNamespace = io.of("/cameras/" + cameraSlug);

            camera.onMove((position) => cameraNamespace.emit("move", position) );
            camera.onOnline((value) => { cameraNamespace.emit("online", value); camerasNamespace.emit("online", {id: camera._id, value: value}); } );

            cameraNamespace.on("connection", function(socket){

                console.log("Sockets: " + cameraSlug + ".connection");

                socket.emit("move", camera.position );
                socket.emit("online", camera.online );

                socket.on("move", (command) => camera.move(command) );
                socket.on("moveto", (pos) => camera.moveTo(pos) );

                socket.on("disconnect", () => console.log("Sockets: " + cameraSlug + ".disconnect") );
            });
        });
    });
}
