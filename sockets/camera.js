var Camera = require("../models/Camera");

module.exports = function(io){

    io.on('connection', function(socket){

        console.log("Sockets: io.connection");

        Camera.findOne({name: "havn"}, function(err, camera){
            socket.on("move", (command) => camera.move(command) );
            socket.on("moveto", (pos) => camera.moveTo(pos) );
            socket.emit("move", camera.position );
        });
    });

    Camera.findOne({name: "havn"}, function(err, camera){
        camera.onMove((position) => io.emit("move", position) );
    });
}
