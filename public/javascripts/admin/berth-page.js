"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();

        var data = $('form').serialize();
        var errorMessage = berthData.new ? "Could not create new berth" : "Could not edit berth";
        var type = berthData.new ? "post" : "put";

        send(type, data, errorMessage, true);

    });

    if (!berthData.new) {
        $("#berthDelete").click(function(e) {
            send("delete", null, "Could not delete berth", true);
        });
    }

});


function send(type, data, errorMessage, redirect) {
    $.ajax({
        url: type === "post" ? '/api/berths' : '/api/berths/' + berthData._id,
        type: type,
        dataType: data ? "json" : null,
        data: data,
        success: function(data) {
            if (redirect) {
                var redirectTo = '/admin/berths';
                // new vs. save, delete
                if (type === "post") { redirectTo +=  "/" + data.number; }
                document.location.href = redirectTo;
            }
        },
        error: function(e) {
            var message = errorMessage + ". " + e.responseText;
            $(".error").text(message);
        }
    });
}
