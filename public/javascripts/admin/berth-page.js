"use strict";

$(document).ready(function(){

    $("form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/berths/' + berthData._id,
            type: "put",
            dataType: "json",
            data: $('form').serialize(),
            success: function(data) {
                        console.log("OK: " + JSON.stringify(data));
                    }
        });
    });

    $("#berthDelete").click(function(e) {
        $.ajax({
            url: '/api/berths/' + berthData._id,
            type: "delete",
            success: function(data) {
                        console.log("DELETED: " + JSON.stringify(data));
                        document.location.href='/admin/berths';
                    }
        });
    });

});
