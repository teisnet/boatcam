"use strict";

var player = null;

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
            case 187: // +
                onMoveCameraKey("zoomIn");
            break;
            case 189: // -
                onMoveCameraKey("zoomOut");
            break;
			case 70: // F
				toggleFullScreen($("#player-container").get(0));
			break;
        }

		// Ctrl key
		if (down[17]) {
			switch(key) {
				case 70: // F - clashes with 'find'
					// requestFullScreen($("#player").get(0));
				break;
			}

		}
    }
});

$(document).keyup(function(event){
    var key = event.which || event.keyCode || 0;
    down[key] = null;
	switch(key) {
		case 38:  // Up
		case 40:  // Down
		case 37:  // Left
		case 39:  // Right
		case 187: // +
		case 189: // -
			onMoveCameraKey("Stop");
		break;
	}
});

$(document).ready(function(){
    $(".play-button").mousedown(onPlayCamera);
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

		$.ajax({
			url: 'api/berths/' + berthId + '/positions/' + config.cameraId,
			type: 'PUT',
			dataType: 'json',
			data: Camera.position,
			success: function(res) {},
			error:   function(err) { console.log("savecamerapos: error " + JSON.stringify(err)); }
		});
    });

    $(".loadcamerapos").bind("click", function(){
        var berthId = $('#berths').val();
        $.getJSON('api/berths/' + berthId + '/positions/' + config.cameraId, function(res){
            Camera.moveTo(res);
        });
    });

	// http://flash.flowplayer.org/documentation/configuration/clips.html
    player = flowplayer("player",
		{
			src: "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf",
			wmode: "direct"  // Needed for 'accellerated' to take effect
		},
		{
        'clip': {
            'url': config.stream,
            'scaling':'fit',
            'live': true,
            'bufferLength': 0.3, //0, 0.1, 0.3 or 2 sec,
            'provider':'rtmp',
			'accelerated': true, // Hardware accelleration,
            'autoplay': true // No effect
        },
		play: null,
        'plugins':{
            'controls': null, // 'controls: null' will not download controlbar at all
			/* 'controls': {
				// display: 'none',
				all: false,
				fullscreen: true,
				backgroundColor: "transparent",
				backgroundGradient: "none",
			}, */
            'rtmp':{
                'url':'http://releases.flowplayer.org/flowplayer.rtmp/flowplayer.rtmp-3.2.13.swf',
                'netConnectionUrl': config.url
                }
            },
        'canvas':{"backgroundColor": "#000000",'backgroundGradient':'none'}
    });


    $(".fullscreen").bind("click", function(){
		toggleFullScreen($("#player-container").get(0));
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
    var element = $(".status-indicator");

   element.removeClass("online offline disabled");
   element.addClass(value.status);
});


function onMoveCameraKey(command) {
    Camera.move(command);
};

function onPlayCamera() {
	player.toggle();
}

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


function toggleFullScreen(element) {
	var requestMethod = null;
	var caller = null;
	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
		requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
		caller = element;
	}
	else {
		requestMethod = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		caller = document;
	}

	if (requestMethod) { // Native full screen.
		requestMethod.call(caller);
	}
	else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}
