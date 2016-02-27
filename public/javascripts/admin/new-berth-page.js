"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();
    });

    $("#berthSubmit").click(function(e) {
        $.ajax({
            url: '/api/berths',
            type: "post",
            dataType: "json",
            data: $('form').serialize(),
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                        document.location.href = '/admin/berths/' + data.number;
                    },
            error: function(e) {
                $(".error").text(e.responseText || "Could not create new berth");
            }
        });
    });

});
