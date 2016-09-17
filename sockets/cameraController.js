"use strict";

const models  = require('../models');
const Camera = models.Camera;

module.exports = function(io){

	Camera.findAll()
	.then(function(cameras){
		cameras.forEach(newCameraHandler);
		Camera.on("new", newCameraHandler);
	});

	function newCameraHandler(camera) {

		let cameraNamespace = io.of("/cameras/" + camera.slug);

		camera.onMove( (position) => cameraNamespace.emit("move", position) );
		camera.onStatus( (status) => cameraNamespace.emit("status", status) );

		cameraNamespace.on("connection", function(socket){

			// BEGIN TEST
			socket.emit('test', { message: 'Hello from camera ' + camera.slug });
			socket.on('test', function (data) {
				console.log(data);
			});
			// END TEST

			console.log("Sockets: " + camera.slug + ".connection");

			socket.emit("move", camera.position );
			socket.emit("status", camera.status );

			socket.on("move", (command) => camera.move(command) );
			socket.on("moveto", (pos) => camera.moveTo(pos) );

			socket.on("snapshot", (data, cb) => {
				camera.snapshot( (err, result) => {
					cb(result);
				} );
			} );

			socket.on("disconnect", () => console.log("Sockets: " + camera.name + ".disconnect") );
		});
	}
}
