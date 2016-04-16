//var logger = require("logger");
//var mongoose = require('mongoose');
var mongoose = require('mongoose');
//var settings = require('settings');

var db = mongoose.connection;
//var dbURI = settings.get("DB") || settings.get("db") || 'mongodb://localhost/test';
var dbURI = 'mongodb://localhost/test';

connectWithRetry();

// When successfully connected
db.on('connected', function () {
	console.log('DB: Connection "' + db.name + '" succesfully opened.');
	// db.host = 'localhost', db.port = 27017, db.name = 'myDatabase'
});

// If the connection throws an error
// db.on('error', console.error.bind(console, 'connection error:'));
db.on('error',function (err) {
  console.error('DB: default connection "' + db.name + '" error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
  console.log('DB: Default connection "' + db.name + '" disconnected');
  // wrong username or password?
});

db.on('reconnect', console.error.bind(console, 'reconnected:'));

// If the Node process ends, close the Mongoose connection
function closeConnectionAndExit() {
	db.close(function () {
		console.log('DB: Default connection "' + db.name + '" disconnected through app termination');
		process.exit(0);
	});
}

process.on('SIGTERM', closeConnectionAndExit);
process.on('SIGINT', closeConnectionAndExit);

function connectWithRetry() {
	var options = { server: { socketOptions: { keepAlive: 1 } } };
	return mongoose.connect(dbURI, options, function(err) {
		if (err) {
			console.warn("DB: ERROR connecting to database '" +  db.name + "' . Will retry in 5 seconds, please start database. ("  + err + ")");
			setTimeout(connectWithRetry, 5000);
			return;
		}
	});
};


module.exports = db;
