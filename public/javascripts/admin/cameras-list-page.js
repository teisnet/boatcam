function loadList (options) {
    doAjaxCall('GET', options.url, null, function(data) {
        useTemplate(options.rowTemplate, data, options.rowsContainer);
    });
}
 
function doAjaxCall(type, url, data, callback) {
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        data: data,
        success: callback
    });
}
 
function useTemplate(template, data, container) {
    if (template) {
        container.empty();
        template.tmpl(data).appendTo(container);
    }
}

//--------------------

var options = {
    url: '/api/cameras/',
    rowTemplate: $('#cameraRowTemplate'),
    rowsContainer: $('#camerasContainer')
};

$(document).ready(function(){
    new RestClient({name:'camera'});
});