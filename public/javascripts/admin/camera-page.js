"use strict";

if (!cameraData.new) {

    var socket = io("/cameras/" + cameraData.slug);

    socket.on("status", function(value){
        var element = $(".status-indicator");
        element.removeClass("online offline disabled");
        element.addClass(value.status);
    });

    $(document).ready(function(){
        $('form #enabled').change(function() {
            var isChecked = $(this).is(':checked');

            $.ajax({
                url: '/api/cameras/' + cameraData._id,
                type: "put",
                dataType: "json",
                data: { enabled: isChecked },
                success: function(data) {
                            console.log("OK: " + JSON.stringify(data));
                        },
                error: function(e) {
                    var message = e.responseText;
                    if (!message) { message = "Could not set camera enabled = " + JSON.stringify(isChecked); }
                    $(".error").text(message);
                }
            });
        });
    });

}


$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();
    });

    $("#cameraSubmit").click(function(e) {
        var formData = $('form').serialize();

        if (!formData.match("enabled")) {
            formData = formData.concat("&enabled=false");
        }

        $.ajax({
            url: cameraData.new ? '/api/cameras' : '/api/cameras/' + cameraData._id,
            type: cameraData.new ? "post" : "put",
            dataType: "json",
            data: formData,
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                        if (cameraData.new) { document.location.href = '/admin/cameras/' + data.slug; }
                    },
            error: function(e) {
                var message = e.responseText;
                if (!message) { message = cameraData.new ? "Could not create new camera" : "Could not edit camera"; }
                $(".error").text(message);
            }
        });
    });

    if (!cameraData.new) {
        $("#cameraDelete").click(function(e) {
            $.ajax({
                url: '/api/cameras/' + cameraData._id,
                type: "delete",
                success: function(data) {
                            console.log("DELETED: " + JSON.stringify(data));
                            document.location.href='/admin/cameras';
                        },
                error: function(e) {
                    $(".error").text(e.responseText || "Could not delete camera");
                }
            });
        });
    };

});
