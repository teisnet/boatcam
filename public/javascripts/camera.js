var Camera = (function(){

    var _camera = {};

    var socket = io("/cameras/" + config.slug);

    socket.on("move", function(pos){
        _camera.position = pos;
        $(_camera).triggerHandler("move", pos);
    });

    socket.on("status", function(value){
        _camera.online = value.online;
        _camera.enabled = value.enabled;
        _camera.status = value.status;
        $(_camera).triggerHandler("status", value);
    });

    _camera.position = {x: 0, y: 0, zoom: 0};
    _camera.online = false;

    _camera.move = function(direction){
            console.log("Camera.move: " + direction);
            socket.emit('move', direction);
        }

    _camera.moveTo = function(pos) {
        console.log("Camera.moveTo: " + JSON.stringify(pos));
        socket.emit('moveto', pos);
    }

    _camera.stop = function() {
        socket.emit('move', "stop");
    }

    _camera.snapshot = function(cb) {
        socket.emit('snapshot', null, function(result) {
            cb(null, result);
        });
    }

    return _camera;
})();
