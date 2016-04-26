"use strict";

$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();
		$.ajax({
			url: '/api/users/' + userData._id,
			type: "PUT",
			dataType: "json",
			data: $('form').serialize(),
			success: function(data) {
				window.location.reload();
			},
			error: function(e) {
				var message = "Could not edit user. " + e.responseText;
				$(".error").text(message);
			}
		});
	});

});
