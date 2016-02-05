var Camera = require("../modules/Camera");

module.exports = function(io){

    io.on('connection', function(socket){
        console.log("A user connected");
        socket.on("move", Camera.move);
        socket.on("set", Camera.set);
    });


    Camera.on("status", function(status){
        io.emit("status", status);
    });

}
