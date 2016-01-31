
var Berth = require("../models/Berth");


createBerth({number: "6-01", owner: "Teis Draiby"});
createBerth({number: "5-04", owner: "Lars Granhøj"});
createBerth({number: "2-07", owner: "Hjalte Granhøj"});

function createBerth(berthData) {
    console.log("New berth: name " + berthData.number + ", title: " + berthData.owner);
      
    var newBerth = new Berth({number: berthData.number, owner: berthData.owner });
    
    newBerth.save(function (err, cam) {
        if (err) {
            console.error("Error creating berth (" + err + ")");
            return console.error(err);
        }
        console.log("Berth saved");
    });
}

