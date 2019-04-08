var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();
  //var ObjectId = require('mongodb').ObjectID;
  //var cursor = db.collection('product').find({});
  // console.log(cursor);
  // // cursor.each(function (err, doc) {
  // //   console.log(doc);
  // // });
  // // res.render('product', { title: 'Express' });
  // //var myId = JSON.parse(req.params.id);
  // return cursor.find({ "_id" : new ObjectId("5c9f14b19d0b824094ab73be") }, function (err, post){
  //   if (err) { throw(err); }
  //   console.log(post.name);
  //   return res.render('product', {title: post.name});
  // })
 
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
