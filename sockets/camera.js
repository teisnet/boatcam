var Camera = require("../modules/Camera");

module.exports = function(io){

    io.on('connection', function(socket){
        console.log("A user connected");
        socket.on("move", Camera.move);
        socket.on("moveto", Camera.moveTo);
    });


    Camera.on("move", function(status){
        io.emit("move", status);
    });

}
