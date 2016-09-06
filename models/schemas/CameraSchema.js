var mongoose = require('mongoose');
var IpCamera = require("../../modules/Camera");

var CameraSchema = new mongoose.Schema({
    enabled: Boolean,
    // Lowercase, no danish letters. Used for urls and logging. "ostrebassin"
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique : true,
        validate: [
            {
                validator: function(value) { return /^[a-z][a-z0-9-_]*$/.test(value); },
                message: "Value must only contain English lowercase characters and numbers, '{VALUE}' is not valid"
            },
            {
                validator: function(value) { return !/^[0-9a-fA-F]{24}$/.test(value); },
                message: "Value cannot be an ObjectId, '{VALUE}' is not valid"
            }
        ]
    },
	title: String,
    uri: String,
    hostname: String,
    onvif: Number,
    http: Number,
    username: { type: String, trim: true },
    password: { type: String, trim: true }
});

CameraSchema.set('toJSON', { virtuals: true });


// available post events: init, validate, save, remove

CameraSchema.post('init', function(doc) {
    this.camera = IpCamera.get(doc._id);
    if (!this.camera) {
        this.camera = new IpCamera(doc);
        // Emit 'new' from 'Camera' model
        this.constructor.emit("new", doc);
    } else {
        this.camera.config(doc);
    }
});

// TODO: Add event for remove too
CameraSchema.post('findOneAndRemove', function(doc) {
    if (!doc) { return; }

    console.log("CameraSchema.remove: " + doc.title);

    this.camera = IpCamera.get(doc._id);
    if (this.camera) {
        this.camera.remove();
        delete this.camera;
        // Emit 'remove' from 'Camera' model
        //this.constructor.emit("removed", doc);
    }
});

CameraSchema.virtual("name")
	.get(function () { return this.slug; });

CameraSchema.virtual("position")
	.get(function () { return this.camera ? this.camera.position : {x: 0, y: 0, zoom: 1.0}; });

CameraSchema.virtual("online")
	.get(function () { return this.camera ? this.camera.online : false; });

CameraSchema.virtual("status")
	.get(function () { return this.camera ? this.camera.status : "disabled"; });

CameraSchema.methods.move = function (command) {
    this.camera.move(command);
};

CameraSchema.methods.moveTo = function (pos) {
    this.camera.moveTo(pos);
};

CameraSchema.methods.snapshot = function (timestampPostfix, cb) {
    this.camera.snapshot(timestampPostfix, cb);
};

CameraSchema.methods.onMove = function (handler) {
    this.camera.on("move", handler);
};

CameraSchema.methods.onStatus = function (handler) {
    this.camera.on("status", handler);
};

CameraSchema.methods.populatePositions = function populatePositions (cb) {
		return this.model('CameraPosition').find({ camera: this._id})
		.populate("berth")
		.exec()
		.then( (berthCameraPositions) => {
			this._positions = berthCameraPositions;
		}); // TODO: Catch
	/*
	.catch(function(err){
		// Catch, call callback with error and re-reject
		cb(err);
		return Promise.reject(err);
	});*/
};

// If populatePositions() has not been called this field won't appear in json
CameraSchema.virtual("positions")
	.get(function () { return this._positions; });

module.exports = CameraSchema;
