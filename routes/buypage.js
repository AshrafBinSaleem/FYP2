var express = require('express');
var router = express.Router();
var authen  = require('../authentication');
//Rending Store Page
router.get('/:id',authen.isLoggedIn, function(req, res, next) {
  var id = new require('mongodb').ObjectID(req.params.id);
  var Product = mongoose.model('product', productSchema,"product");
//product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
  Product.findOne({_id: id},async function(error, product){
        if (error) return console.error(error);
        console.log(product);
        
        res.render('buypage',{prod: product, id: id});
    });
});
module.exports = router;
