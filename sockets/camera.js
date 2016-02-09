const Camera = require("../models/Camera");

module.exports = function(io){

    Camera.find({}, function(err, cameras){
        cameras.map(function(camera){

            var cameraSlug = camera.name.toLowerCase();

            var cameraNamespace = io.of(cameraSlug);
            camera.onMove((position) => cameraNamespace.emit("move", position) );

            cameraNamespace.on("connection", function(socket){

                console.log("Sockets: " + cameraSlug + ".connection");

                socket.emit("move", camera.position );

                socket.on("move", (command) => camera.move(command) );
                socket.on("moveto", (pos) => camera.moveTo(pos) );

                socket.on("disconnect", ()=> console.log("Sockets: " + cameraSlug + ".disconnect") );
            });
        });
    });
}
