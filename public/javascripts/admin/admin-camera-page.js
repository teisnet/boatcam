"use strict";

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
            url: '/api/cameras/' + cameraData._id,
            type: "put",
            dataType: "json",
            data: formData,
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                    },
            error: function(e) {
                $(".error").text(e.responseText || "Could not edit camera");
            }
        });
    });

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

});
