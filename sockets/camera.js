var cameras = require("../modules/Cameras");

module.exports = function(io){

    io.on('connection', function(socket){
        var camera = cameras[2];
        console.log("A user connected");
        socket.on("move", (command) => camera.move(command) );
        socket.on("moveto", (pos) => camera.moveTo(pos) );
        socket.emit("move", camera.position );

        // TODO: Handle properly outside handler.
        camera.on("move", (position) => io.emit("move", position) );
    });
}
