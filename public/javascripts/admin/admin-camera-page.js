"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();

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
                    }
        });
    });

});
