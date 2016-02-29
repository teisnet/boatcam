"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();

        $.ajax({
            url:   berthData.new ? '/api/berths' : '/api/berths/' + berthData._id,
            type:  berthData.new ? "post" : "put",
            dataType: "json",
            data: $('form').serialize(),
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                        if (berthData.new) { document.location.href = '/admin/berths/' + data.number; }
                    },
            error: function(e) {
                var message = e.responseText;
                if (!message) { message = berthData.new ? "Could not create new berth" : "Could not edit berth"; }
                $(".error").text(message);
            }
        });
    });

    if (!berthData.new) {
        $("#berthDelete").click(function(e) {
            $.ajax({
                url: '/api/berths/' + berthData._id,
                type: "delete",
                success: function(data) {
                            console.log("DELETED: " + JSON.stringify(data));
                            document.location.href='/admin/berths';
                        },
                error: function(e) {
                    $(".error").text(e.responseText || "Could not delete berth");
                }
            });
        });
    }

});
