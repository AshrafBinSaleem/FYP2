var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var mongoUtil = require( '../mongoUtils' );
var db = mongoUtil.getDb();

 var cursor = db.collection( 'product' ).find();
 cursor.each(function(err,doc) {
   console.log(doc);
 });

  res.render('product', { title: 'Express' });
});

module.exports = router;
