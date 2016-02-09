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

router.get('/berths/:id', function(req, res, next) {
    var id = req.params.id;
    Berth.findById(id, function(err, berth){
        if (!berth) {
            // TODO: consider returning null in subobject
            res.status(404).send('There is no berth with id ' + id);
            return;
        }
        res.json(berth);
    });
});

router.route('/berths/:id/positions')
.get(function(req, res, next){
    var id = req.params.id;
    Berth.findById(id, function(err, berth){
        if (!berth) {
            // TODO: consider returning empty array in subobject
            res.status(404).send('There is no berth with id ' + id);
            return;
        }
        res.json(berth.positions[0]);
    });
})
.post(function(req, res, next) {
    var berthId = req.params.id;
        
    var newPosition = {cameraId: "56abf7797e59e98422a1cf0d", x: req.body.x, y: req.body.y, zoom: req.body.zoom }
    
    // find by document id and update
    Berth.findByIdAndUpdate(
        berthId,
        { $pull: { positions: { cameraId: new ObjectId("56abf7797e59e98422a1cf0d") } } },
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
