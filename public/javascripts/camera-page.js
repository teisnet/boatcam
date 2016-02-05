
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
        $.post('api/berths/' + berthId + '/positions', Camera.status, function(res){ });
    });

    $(".loadcamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.getJSON('api/berths/' + berthId + '/positions', function(res){
            Camera.moveTo(res);
        });
    });
});

$.getJSON('api/berths', function(berthData) {
    $(berthData).each(function (index, berth) {
        var $option = $("<option/>").attr("value", berth._id).text(berth.number + " - " + berth.owner);
        $('#berths').append($option);
    });
});

$(Camera).on('move', function (event, pos) {
    $('.status').text("x: " + pos.x + "\xB0 y: " + pos.y + "\xB0 zoom: " + pos.zoom + "x");
});


function onMoveCamera(event) {
    Camera.move(event.data);
    $(document).bind("mouseup", onStopCamera);
};

function onStopCamera() {
    Camera.stop();
    $(document).unbind("mouseup", onStopCamera);
}
