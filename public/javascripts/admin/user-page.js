"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();

        var data = $('form').serialize();
        var errorMessage = userData.new ? "Could not create new user" : "Could not edit user";
        var type = userData.new ? "post" : "put";

        send(type, data, errorMessage, true);

    });

    if (!userData.new) {
        $("#userDelete").click(function(e) {
            send("delete", null, "Could not delete user", true);
        });
    }

});


function send(type, data, errorMessage, redirect) {
    $.ajax({
        url: type === "post" ? '/api/users' : '/api/users/' + userData._id,
        type: type,
        dataType: data ? "json" : null,
        data: data,
        success: function(data) {
            if (redirect) {
                var redirectTo = '/admin/users';
                // new vs. save, delete
                if (type === "post") { redirectTo +=  "/" + data._id; }
                document.location.href = redirectTo;
            }
        },
        error: function(e) {
            var message = errorMessage + ". " + e.responseText;
            $(".error").text(message);
        }
    });
}
