var Camera = require("../modules/Camera");

var camera = new Camera({
    hostname: "85.27.160.128",
    username: "admin",
    password: "admin",
    port:     "8080"
});

module.exports = function(io){

    io.on('connection', function(socket){
        console.log("A user connected");
        socket.on("move", (command) => camera.move(command) );
        socket.on("moveto", (pos) => camera.moveTo(pos) );
        socket.emit("move", camera.position );
    });

    camera.on("move", (position) => io.emit("move", position) );
}
