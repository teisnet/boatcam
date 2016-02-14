var Camera = (function(){

    var _camera = {};

    var socket = io("/cameras/" + config.slug);

    socket.on("move", function(pos){
        _camera.position = pos;
        $(_camera).triggerHandler("move", pos);
    });

    socket.on("online", function(value){
        _camera.online = value;
        $(_camera).triggerHandler("online", value);
    });

    _camera.position = {x: 0, y: 0, zoom: 0};
    _camera.online = false;

    _camera.move = function(direction){
            console.log("Camera.move: " + direction);
            socket.emit('move', direction);
        }

    _camera.moveTo = function(pos) {
        console.log("Camera.moveTo: " + pos);
        socket.emit('moveto', pos);
    }

    _camera.stop = function() {
        socket.emit('move', "stop");
    }

    return _camera;
})();
