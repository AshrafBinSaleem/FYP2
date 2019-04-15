var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {
    
    var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();
 
  var id = new require('mongodb').ObjectID(req.params.id);

  var Product = mongoose.model('product', productSchema,"product");


    Product.findOne({title: "Sekiro"}, function(error, product){
        if (error) return console.error(error);
        console.log(product);
        var Company = mongoose.model('company', companySchema,"company");

        Company.findOne({_id: product.publisher}, function(error, company) {
            console.log(company);
            res.render('testpage',{mgobj: product});
        });
        
    });

    
});




module.exports = router;
