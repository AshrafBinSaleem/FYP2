//Index Page etc
var express = require('express');
var router = express.Router();
var authen  = require('../authentication');
/* GET home page. */
router.get('/', function (req, res, next) {
  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();
 
  var id = new require('mongodb').ObjectID("5c9f14b19d0b824094ab73be");

  db.collection('product').findOne({'_id':id})
  .then(function(doc){
    //console.log(doc);
    console.log(doc.title)
    return res.render('product', {'title': doc.title, 
    'developer': doc.company, 
    'publisher': doc.publisher, 
    'releaseDate': doc.date.toDateString(), 
    'price':doc.price, 
    'productRating':doc.review_Score,
    'p1': doc.desc,
    'p2': doc.introduction,
    'p3': doc.setting,
    'imageLink': doc.imageLink
  } );
    
  });

 
});

module.exports = router;
