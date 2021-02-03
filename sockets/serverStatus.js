"use strict";

// Server status:
// Server and database errors, connected clients

let serverStatus = { status: true, message: "ok" };

module.exports = function(io){

let serverStatusNamespace = io.of("/server-status");
	serverStatusNamespace.on("connection", function(socket){
		socket.emit("status", serverStatus );
	});
}
