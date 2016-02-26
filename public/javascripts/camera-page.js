var down = {};

$(document).keydown(function(event){
    var key = event.which || event.keyCode || 0;

    if (!down[key]) { // first press
        down[key] = true; // record that the key's down

        switch(key) {
            case 38:
                onMoveCameraKey("up");
            break;
            case 40:
                onMoveCameraKey("down");
            break;
            case 37:
                onMoveCameraKey("left");
            break;
            case 39:
                onMoveCameraKey("right");
            break;
        }
    }
});

$(document).keyup(function(event){
    var key = event.which || event.keyCode || 0;
    down[key] = null;
    onMoveCameraKey("Stop");
});

$(document).ready(function(){
    $(".camera-control .up").mousedown("up",onMoveCamera);
    $(".camera-control .left").mousedown("left",onMoveCamera);
    $(".camera-control .right").mousedown("right",onMoveCamera);
    $(".camera-control .down").mousedown("down",onMoveCamera);

    $(".camera-control .stop").mousedown(onStopCamera);
    $(".camera-control .zoom-in").mousedown("zoomIn",onMoveCamera);
    $(".camera-control .zoom-out").mousedown("zoomOut",onMoveCamera);

    $(".camera-control .snapshot").click(onSnapshot);

    $(".savecamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.post('api/berths/' + berthId + '/positions/' + config.cameraId, Camera.position, function(res){ });
    });

    $(".loadcamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.getJSON('api/berths/' + berthId + '/positions/' + config.cameraId, function(res){
            Camera.moveTo(res);
        });
    });

    flowplayer("player", "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf", {
        'clip': {
            'url': config.stream,
            'scaling':'fit',
            'live': true,
            'bufferLength': 0,
            'bufferTime': 0,
            'provider':'rtmp',
            'autoplay': true // No effect
        },
        'plugins':{
            'controls': { display: 'none'},
            'rtmp':{
                'url':'http://releases.flowplayer.org/flowplayer.rtmp/flowplayer.rtmp-3.2.13.swf',
                'netConnectionUrl': config.url
                }
            },
        'canvas':{"backgroundColor": "#000000",'backgroundGradient':'none'}
    });

});

$.getJSON('api/berths', function(berthData) {
    $(berthData).each(function (index, berth) {
        var $option = $("<option/>").attr("value", berth._id).text(berth.number + " - " + berth.owner);
        $('#berths').append($option);
    });
});

$(Camera).on('move', function (event, pos) {
    $('.status').text("x: " + pos.x.toFixed(1) + "\xB0 y: " + pos.y.toFixed(1) + "\xB0 zoom: " + pos.zoom.toFixed(1) + "x");
});

$(Camera).on('status', function (event, value) {
    var element = $("#status-field");

   element.removeClass("online offline disabled");
   element.addClass(value.status);
});


function onMoveCameraKey(command) {
    Camera.move(command);
};

function onMoveCamera(event) {
    Camera.move(event.data);
    $(document).bind("mouseup", onStopCamera);
};

function onStopCamera() {
    Camera.stop();
    $(document).unbind("mouseup", onStopCamera);
}

function onSnapshot() {
    var snapshotWindow = window.open("","Snapshot","");
    Camera.snapshot(function(err, result) {
        snapshotWindow.location = "/snapshots/" + result;
    });
}
