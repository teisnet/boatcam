"use strict";
 
var selectedListElement = null;

var options = {
    name: 'camera',
    // url: '/api/cameras/',
    // rowTemplate: $('#cameraRowTemplate'),
    // rowsContainer: $('#camerasContainer'),
    onSelect: function(data){
        if (!data) return;
        if (selectedListElement) { selectedListElement.removeClass("selected"); }
        selectedListElement = $("#" + data._id);
        selectedListElement.addClass("selected");
    },
    onError: function (err){
        var message = err.responseText;
        $(".error").text(message);
    }
};

$(document).ready(function(){
    var restClient = new RestClient(options);
});
