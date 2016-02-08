//var logger = require("logger");
//var mongoose = require('mongoose');
var mongoose = require('mongoose');
//var settings = require('settings');

var db = mongoose.connection;
//var dbURI = settings.get("DB") || settings.get("db") || 'mongodb://localhost/test';
var dbURI = 'mongodb://localhost/test';

mongoose.connect(dbURI, function(err){
	if (err) {
		console.error("DB: ERROR connecting to database '" +  db.name + "' (please start database before starting server). "  + err);
		process.exit(0);
		return;
	} 
});


// When successfully connected
db.on('connected', function () {
	console.log('DB: Connection "' + db.name + '" succesfully opened.');
	
	// db.host // localhost
	// db.port // 27017
	//db.name // myDatabase

	// Show database version
	var admin = new mongoose.mongo.Admin(db.db);
	admin.buildInfo(function (err, info) {		
		console.log("DB: MongooDB version = " + info.version + ", Mongoose version = " + mongoose.version );
	});
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
process.on('SIGINT', function() {
  db.close(function () {
    console.log('DB: Default connection "' + db.name + '" disconnected through app termination');
    process.exit(0);
  });
});


module.exports = db;
