var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {
    
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("succesfully connected");
    });


    var Kitten = mongoose.model('kitty', kittySchema,"test");

    Kitten.findOne({name: "amirul"}, function(error, kitten){
        if (error) return console.error(error);
        console.log(kitten);
        kitten.arrdata.forEach(element => {
            console.log(element);
        });
        res.render('testpage',{mgobj: kitten});
    });

    
});




module.exports = router;
