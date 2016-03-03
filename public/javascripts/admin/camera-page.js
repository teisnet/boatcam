"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();

        var formData = $('form').serialize();

        if (!formData.match("enabled")) {
            formData = formData.concat("&enabled=false");
        }

        var errorMessage = cameraData.new ? "Could not create new camera" : "Could not edit camera";
        var type = cameraData.new ? "post" : "put";
        send(type, formData, errorMessage, true);

    });

});


if (!cameraData.new) {

    var socket = io("/cameras/" + cameraData.slug);

    socket.on("status", function(value){
        var element = $(".status-indicator");
        element.removeClass("online offline disabled");
        element.addClass(value.status);
    });

    $(document).ready(function(){

        $("#cameraDelete").click(function() {
            send("delete", null, "Could not delete camera", true);
        });

        $('form #enabled').change(function() {
            var isChecked = $(this).is(':checked');
            send("put", { enabled: isChecked }, "Could not set camera enabled = " + JSON.stringify(isChecked));
        });

    });

}


function send(type, data, errorMessage, redirect) {
    $.ajax({
        url: type === "post" ? '/api/cameras' : '/api/cameras/' + cameraData._id,
        type: type,
        dataType: data ? "json" : null,
        data: data,
        success: function(data) {
            if (redirect) {
                var redirectTo = '/admin/cameras';
                // new vs. save, delete
                if (type === "post") { redirectTo +=  "/" + data.slug; }
                document.location.href = redirectTo;
            }
        },
        error: function(e) {
            var message = errorMessage + ". " + e.responseText;
            $(".error").text(message);
        }
    });
}
