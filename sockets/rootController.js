"use strict";

const models  = require('../models');
const Camera = models.Camera;

module.exports = function(io){
	// TEST
	io.on('connection', function (socket) {
		socket.emit('test', { message: 'Hello from BoatCam' });
		socket.on('test', function (data) {
			console.log(data);
		});
	});
	// END TEST
}
