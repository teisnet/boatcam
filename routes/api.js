var express = require('express');
var router = express.Router();

var ObjectId = require('mongoose').Types.ObjectId;

var Berth = require("../models/Berth");
var Camera = require("../models/Camera");
var CameraPosition = require("../models/CameraPosition");

// CAMERAS
router.route('/cameras')
// Get all
.get(function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.json(cameras);
    });
})
// Create
.post(function(req, res, next) {
    var newCameraParams = req.body;
    // find by document id and update
    var newCamera = new Camera(newCameraParams);
    newCamera.save(function(err, camera){
        res.json(camera);
    });
})


router.route('/cameras/:cameraId')
// Get one
.get(function(req, res, next) {
    var cameraId = req.params.cameraId;
    Camera.findById(cameraId, function(err, camera){
        if (!camera) {
            res.status(404).send('There is no camera with id ' + cameraId);
            return;
        }
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
        { new: true},
        function(err, camera) {
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
            res.sendStatus(200);
        }
    );
});


// BERTHS

router.route('/berths')
// Get all
.get(function(req, res, next) {
    Berth.find({}, function(err, berths){
        res.json(berths);
    });
})
// Create
.post(function(req, res, next) {
    var changes = req.body;
    // find by document id and update
    var berth = new Berth(changes);
    berth.save(function(err, b){
        res.json(berth);
    });
});


router.route('/berths/:berthId')
// Get one
.get(function(req, res, next) {
    var berthId = req.params.berthId;
    Berth.findById(berthId, function(err, berth){
        if (!berth) {
            // TODO: consider returning null in subobject
            res.status(404).send('There is no berth with id ' + berthId);
            return;
        }
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
        { new: true},
        function(err, berth) {
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
    /*Berth.findOne({_id: berthId, "positions.cameraId" : cameraId}, {'positions.$': 1}, function(err, berth){
        if (!berth) {
            // TODO: consider returning empty array in subobject
            res.status(404).send('Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
            return;
        }
        res.json(berth.positions[0]);
    });
    */
    CameraPosition.find({camera: new ObjectId(cameraId), berth: new ObjectId(berthId)}, function(err, positions){
        res.json(positions);
    });
})
// Create / update
.post(function(req, res, next) {
    var berthId = req.params.berthId;
    var cameraId = req.params.cameraId;

    var newPosition = {cameraId: cameraId, x: req.body.x, y: req.body.y, zoom: req.body.zoom }

    // find by document id and update
    Berth.findByIdAndUpdate(
        berthId,
        { $pull: { positions: { cameraId: new ObjectId(cameraId) } } },
        function(err, berth) {
            Berth.findByIdAndUpdate(
                berthId,
                {$push: {positions: newPosition}},
                function(err, model) {
                    console.log(err);
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
