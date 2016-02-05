var socket = io();
var cameraStatus = {x: 0, y: 0, zoom: 0};
console.log("Camera");

socket.on("status", function(_sta){
   cameraStatus = _sta;
   var sta = {};
    sta.x = parseFloat(_sta.x / 100).toFixed(1);
    sta.y = parseFloat(_sta.y / 100).toFixed(1);
    sta.zoom = parseFloat(_sta.zoom / 1000).toFixed(1);
    
    $('.status').text("x: " + sta.x + "\xB0 y: " + sta.y + "\xB0 zoom: " + sta.zoom + "x");
  
});

function beginMoveCamera(direction){
    console.log("moveCamera: " + direction);
    socket.emit('move', direction);
    
    $(document).bind("mouseup", stopCamera);
}


function stopCamera() {
    socket.emit('move', "stop");
    $(document).unbind("mouseup", stopCamera);
}


// API

$.getJSON('api/berths', function(data) {
    var $select = $('#berths');
    $(data).each(function (index, o) {    
        var $option = $("<option/>").attr("value", o._id).text(o.number + " - " + o.owner);
        $select.append($option);
    });
    /*$.each(data, function(index, berth){
        //console.log(berth);
        var $select = $('#mySelectID');
    })*/;
});

function onMoveCamera(event) {
    beginMoveCamera(event.data);
};

$(document).ready(function(){
    $(".camera-control .up").mousedown("up",onMoveCamera);
    $(".camera-control .left").mousedown("left",onMoveCamera);
    $(".camera-control .right").mousedown("right",onMoveCamera);
    $(".camera-control .down").mousedown("down",onMoveCamera);

    $(".savecamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.post('api/berths/' + berthId + '/positions', cameraStatus, function(res){ });
    });
});
