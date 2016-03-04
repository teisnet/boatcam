"use strict";
 
var selectedListElement = null;

var options = {
    name: 'camera',
    // url: '/api/cameras/',
    // rowTemplate: $('#cameraRowTemplate'),
    // rowsContainer: $('#camerasContainer'),
    onSelect: function(data){
        if (!data) return; // Dilemma: first call is empty even for camera routes, but a method to select 'none' is also needed.
        setSelected(data);
        if (data) {
            history.pushState(data, data.title, "admin/cameras-list/" + data.slug);
        } else {
            history.pushState(null, "Cameras", "admin/cameras-list");
        }
    },
    onError: apiErrorHandler
};

function setSelected(data){
    if (selectedListElement) { selectedListElement.removeClass("selected"); }
    if (data) {
        selectedListElement = $("#" + data._id);
        selectedListElement.addClass("selected");
    }
}

function apiErrorHandler (err){
    var message = err.responseText;
    $(".error").text(message);
}

$(document).ready(function(){

    window.onpopstate = function(event){
        var data = event.state;
        setSelected(data);
        restClient.select(data);
    }

    var restClient = new RestClient(options);

    // Client side redirect if sub-route points to a camera instance
    var path = window.location.pathname;
    path = path.match(/^\/admin\/cameras-list(\/(.*))?$/)[2];
    if (path) {
        $.ajax({
            type: "get",
            url: "api/cameras/" + path,
            dataType: "json"
        })
        .done(function(data){
            restClient.select(data);
            setSelected(data);
        })
        .fail(apiErrorHandler);
    }
});
