"use strict";

var socket = io("/cameras");

socket.on("status", function(status){
    $.isArray(status) ? status.map(function(value) { setStatus(value); }) : setStatus(status);
});

function setStatus(status) {
    var element = $("#" + status._id);

   element.removeClass("online offline disabled");
   element.addClass(status.status);
}
