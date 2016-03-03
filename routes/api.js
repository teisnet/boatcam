"use strict";

var express = require('express');
var router = express.Router();

var ObjectId = require('mongoose').Types.ObjectId;

var Berth = require("../models/Berth");
var Camera = require("../models/Camera");

// TODO: respond with 500 at database connection failures

// Format Mogoose errors
function createErrorMessage(err) {
    let message = "";
    let errors = err.errors;

    if (err.code === 11000) {
        message += "Field value must be unique. Another item has the same value for thit field."
    } else {
        for (var field in errors) {
            if (errors.hasOwnProperty(field)) {
                message += field + ": " + errors[field].message + ". ";
            }
        }
    }

   return message;
}

function handleError(res, err, message) {
    // 400 (Bad Request)
    var errorMessage = message + ". " + createErrorMessage(err);
    res.status(400).send(errorMessage);
    console.error("400 Bad Request:" + errorMessage);
}


function handleNotFound(res, message) {
    // 404 (Not Found)
    res.status(404).send(message);
    console.warn("404 Not Found:" + message);
}

// CAMERAS
router.route('/cameras')
// Get all
.get(function(req, res, next) {
    Camera.find({}, function(err, cameras) {
        if (err) return handleError(res, err, "Could not get cameras");
        res.json(cameras);
    });
})
// Create
.post(function(req, res, next) {
    var newCameraParams = req.body;
    // find by document id and update
    var newCamera = new Camera(newCameraParams);
    newCamera.save(function(err, camera){
        if (err || !camera) return handleError(res, err, "Could not create camera");
        // 201 (Created)
        res.status(201).json(camera);
    });
})


router.route('/cameras/:cameraId')
// Get one
.get(function(req, res, next) {
    var cameraId = req.params.cameraId;
    Camera.findById(cameraId, function(err, camera){
        if (err) return handleError(res, err, "Could not get camera " + cameraId);
        if(!camera) return handleNotFound(res, "Camera " + cameraId + " not found");
        res.json(camera);
    });
})
// Update
.put(function(req, res, next) {
    var cameraId = req.params.cameraId;
    var changes = req.body;
    // find by document id and update
    Camera.findByIdAndUpdate(
        cameraId,
        { $set:  changes},
        { new: true, runValidators: true },
        function(err, camera) {
            if (err) return handleError(res, err, "Could not update camera " + cameraId);
            if(!camera) return handleNotFound(res, "Camera " + cameraId + " not found");
            // TODO: Update camera instance accordingly
            res.json(camera);
        }
    );
})
// Delete
.delete(function(req, res, next) {
    var cameraId = req.params.cameraId;
    Camera.findByIdAndRemove(
        cameraId,
        function(err) {
            if (err) return handleError(res, err, "Could not delete camera " + cameraId);
            res.sendStatus(200);
        }
    );
});


// BERTHS

router.route('/berths')
// Get all
.get(function(req, res, next) {
    Berth.find({}, function(err, berths){
        if (err) return handleError(res, err, "Could not get berths");
        res.json(berths);
    });
})
// Create
.post(function(req, res, next) {
    var changes = req.body;
    // find by document id and update
    var newBerth = new Berth(changes);
    newBerth.save(function(err, berth){
        if (err || !berth) return handleError(res, err, "Could not create berth");
        // 201 (Created)
        res.status(201).json(berth);
    });
});


router.route('/berths/:berthId')
// Get one
.get(function(req, res, next) {
    var berthId = req.params.berthId;
    Berth.findById(berthId, function(err, berth){
        if (err) return handleError(res, err, "Could not get berth " + berthId);
        if(!berth) return handleNotFound(res, "Berth " + berthId + " not found");
        res.json(berth);
    });
})
// Update
.put(function(req, res, next) {
    var berthId = req.params.berthId;
    var changes = req.body;
    // find by document id and update
    Berth.findByIdAndUpdate(
        berthId,
        { $set:  changes},
        { new: true, runValidators: true },
        function(err, berth) {
            if (err) return handleError(res, err, "Could not update berth " + berthId);
            if(!berth) return handleNotFound(res, "Berth " + berthId + " not found");
            res.json(berth);
        }
    );
})
// Delete
.delete(function(req, res, next) {
    var berthId = req.params.berthId;
    Berth.findByIdAndRemove(
        berthId,
        function(err) {
            if (err) return handleError(res, err, "Could not delete berth " + berthId);
            res.sendStatus(200);
        }
    );
});


// BERTH CAMERA POSITIONS
router.route('/berths/:berthId/positions/:cameraId')
// Get
.get(function(req, res, next){
    var berthId = req.params.berthId;
    var cameraId = req.params.cameraId;
    Berth.findOne({_id: berthId, "positions.camera" : cameraId}, {'positions.$': 1}, function(err, berth){
        if (err) return handleError(res, err, "Could not get position for berth " + berthId + " and camera " + cameraId);
        // TODO: consider returning empty array in subobject
        if(!berth) return handleNotFound(res, 'Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
        res.json(berth.positions[0]);
    });
})
// Create / update
.post(function(req, res, next) {
    var berthId = req.params.berthId;
    var cameraId = req.params.cameraId;

    var newPosition = {camera: cameraId, x: req.body.x, y: req.body.y, zoom: req.body.zoom }

    // find by document id and update
    Berth.findByIdAndUpdate(
        berthId,
        { $pull: { positions: { camera: new ObjectId(cameraId) } } },
        { runValidators: true },
        function(err, berth) {
            if (err) return handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
            Berth.findByIdAndUpdate(
                berthId,
                {$push: {positions: newPosition}},
                function(err, model) {
                    if (err) return handleError(res, err, "Could not save position for berth " + berthId + " and camera " + cameraId);
                    //req.body.x, y and zoom
                    res.json({ message: 'Created Berth position, berthId = ' + berthId});
                }
        );
    });

    /*Berth.findById(req.params.id).exec()
    .then(function(doc){
        doc.positions.pull({ cameraId: new ObjectId("56abf7797e59e98422a1cf0d") });
        doc.markModified('positions');
        doc.save();
    })
    */
});




module.exports = router;
