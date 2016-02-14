"use strict";

var socket = io("/cameras");

socket.on("online", function(status){
    $.isArray(status) ? status.map(function(value) { setOnline(value); }) : setOnline(status);
});

function setOnline(status) {
    $("#" + status.id + " .circle").css('background-color', status.value ? '#0F0' : 'red');
}