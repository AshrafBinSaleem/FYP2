var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {
    
    var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();
 
  var id = new require('mongodb').ObjectID(req.params.id);

  var Sales = mongoose.model('sales', salesSchema, "sales");

  Sales.aggregate([{
    $group: {
      _id : {MaxMonth: { $max : { $month: "$date"} }, year: { $max : {$year: "$date"} } }
      }
  }],function(err, obj)
  {
    console.log(obj);
  })
  
  
    Sales.aggregate([{
    $group: {
      _id : {month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
      title : {$first : "$title"} ,
      month : {$first : {$month: "$date"} }, 
      count: { $sum: 1 }
      },
    
  },
  {$sort : {title: 1, month: 1 }}],function(err, obj)
  {
    console.log(obj);
  })
  

  Sales.find().distinct('title',function(error, titles){
    if (error) return console.error(error);
        //console.log(sales);
        titles.forEach(element => {
           console.log(element); 
        });
         res.render('testpage',{tit: titles});

  });

//   var Product = mongoose.model('product', productSchema,"product");


//     Product.findOne({title: "Sekiro"}, function(error, product){
//         if (error) return console.error(error);
//         console.log(product);
//         var Company = mongoose.model('company', companySchema,"company");

//         Company.findOne({_id: product.publisher}, function(error, company) {
//             console.log(company);
//             res.render('testpage',{mgobj: product});
//         });
        
    // });

    
});




module.exports = router;
