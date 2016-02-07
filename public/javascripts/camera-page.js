$(document).ready(function(){
    $(".camera-control .up").mousedown("up",onMoveCamera);
    $(".camera-control .left").mousedown("left",onMoveCamera);
    $(".camera-control .right").mousedown("right",onMoveCamera);
    $(".camera-control .down").mousedown("down",onMoveCamera);

    $(".camera-control .stop").mousedown(onStopCamera);
    $(".camera-control .zoom-in").mousedown("zoomIn",onMoveCamera);
    $(".camera-control .zoom-out").mousedown("zoomOut",onMoveCamera);

    $(".savecamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.post('api/berths/' + berthId + '/positions', Camera.position, function(res){ });
    });

    $(".loadcamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.getJSON('api/berths/' + berthId + '/positions', function(res){
            Camera.moveTo(res);
        });
    });

    flowplayer("player", "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf", {
        'clip': {
            'url':'HavneCam.stream',
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
                'netConnectionUrl': 'rtmp://85.27.160.128:1935/live'
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
    $('.status').text("x: " + (pos.x).toFixed(1) + "\xB0 y: " + (pos.y).toFixed(1) + "\xB0 zoom: " + (pos.zoom).toFixed(1) + "x");
});


function onMoveCamera(event) {
    Camera.move(event.data);
    $(document).bind("mouseup", onStopCamera);
};

function onStopCamera() {
    Camera.stop();
    $(document).unbind("mouseup", onStopCamera);
}
