var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function (req, res, next) {
 //creating an variable id to match object ID
  var id = new require('mongodb').ObjectID(req.params.id);
// creating a var model using mongoose.model function
  var Product = mongoose.model('product', productSchema,"product");
//product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
  Product.findOne({_id: id}, function(error, product){
        if (error) return console.error(error);
        console.log(product);
       
        res.render('product',{prod: product});
//res.render product is rendering the product 'product'
    });
 
});

module.exports = router;
