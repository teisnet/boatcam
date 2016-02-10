var express = require('express');
var router = express.Router();

var ObjectId = require('mongoose').Types.ObjectId;

var Berth = require("../models/Berth");
var Camera = require("../models/Camera");


router.get('/cameras', function(req, res, next) {
    Camera.find({}, function(err, cameras){
        res.json(cameras);
    });
});

router.get('/berths', function(req, res, next) {
    Berth.find({}, function(err, berths){
        res.json(berths);
    });
});

router.get('/berths/:berthId', function(req, res, next) {
    var berthId = req.params.berthId;
    Berth.findById(berthId, function(err, berth){
        if (!berth) {
            // TODO: consider returning null in subobject
            res.status(404).send('There is no berth with id ' + berthId);
            return;
        }
        res.json(berth);
    });
});

router.route('/berths/:berthId/positions/:cameraId')
.get(function(req, res, next){
    var berthId = req.params.berthId;
    var cameraId = req.params.cameraId;
    Berth.findOne({_id: berthId, "positions.cameraId" : cameraId}, {'positions.$': 1}, function(err, berth){
        if (!berth) {
            // TODO: consider returning empty array in subobject
            res.status(404).send('Berth id ' + berthId + " containing position with camera id " + cameraId + " not found");
            return;
        }
        res.json(berth.positions[0]);
    });
})
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
