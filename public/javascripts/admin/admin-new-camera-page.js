"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/cameras',
            type: "post",
            dataType: "json",
            data: $('form').serialize(),
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                        document.location.href = '/admin/cameras/' + data.name.toLowerCase();
                    }
        });
    });

});
