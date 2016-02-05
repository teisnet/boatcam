
var Camera = (function(){

    var _camera = {};

    var socket = io();

    socket.on("move", function(_sta){
        _camera.position = _sta;
        var sta = {};
            sta.x = parseFloat(_sta.x / 100.0).toFixed(1);
            sta.y = parseFloat(_sta.y / 100.0).toFixed(1);
            sta.zoom = parseFloat(_sta.zoom / 1000.0).toFixed(1);

            $(_camera).triggerHandler("move", sta);
    });

    _camera.position = {x: 0, y: 0, zoom: 0};

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
