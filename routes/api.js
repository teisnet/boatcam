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
    Berth.findOne({_id: req.params.id}, function(err, berth){
        res.json(berth);
    });
});

router.route('/berths/:id/positions').post(function(req, res, next) {
    /*Berth.findOne({_id: req.params.id}, function(err, berth){
        res.json(berth);
    });*/
    // ObjectId("56abf7797e59e98422a1cf0d")
        
    var newPosition = {cameraId: "56abf7797e59e98422a1cf0d", x: req.body.x, y: req.body.y, zoom: req.body.zoom }
    
    // find by document id and update
    Berth.findOneAndUpdate(
        {_id: req.params.id},
        { $pull: { positions: { cameraId: new ObjectId("56abf7797e59e98422a1cf0d") } } },
        function(err, berth) {
            Berth.findByIdAndUpdate(
            req.params.id,
            {$push: {positions: newPosition}},
            function(err, model) {
                console.log(err);
                console.log("Berth id: " + req.params.id + ", posx: " + req.body.x);
                res.json({ message: 'Berth position created!' });
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
