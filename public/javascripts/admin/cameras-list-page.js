"use strict";
 
var options = {
    name: 'camera',
    // url: '/api/cameras/',
    // rowTemplate: $('#cameraRowTemplate'),
    // rowsContainer: $('#camerasContainer'),
};

$(document).ready(function(){
    var restClient = new RestClient(options);
});
