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
            url: '/api/cameras',
            type: "post",
            dataType: "json",
            data: formData,
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                        document.location.href = '/admin/cameras/' + data.slug;
                    },
            error: function(e) {
                $(".error").text(e.responseText || "Could not create new camera");
            }
        });
    });

});
