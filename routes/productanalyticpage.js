var express = require('express');
var router = express.Router();

//Rendering analytic Page
router.get('/:id', function(req, res, next) {
   //creating an variable id to match object ID
   var id = new require('mongodb').ObjectID(req.params.id);
   // creating a var model using mongoose.model function
     var Product = mongoose.model('product', productSchema,"product");
   //product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
     Product.findOne({_id: id}, async function(error, product){
           if (error) return console.error(error);
           console.log(product);
        
  

    //Starting here
    //Declaring MongoUtils and getting Db
  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();

  //Declaring ID = ID in mongoDB
  //var id = new require('mongodb').ObjectID(req.params.id);
  
  //Declaring Sales as the mongoose.model (salesSchema)
  var Sales = mongoose.model('sales', salesSchema, "sales");
  //Declaring Product as the mongoose.modle (productSchema)
  //var Product = mongoose.model('product', productSchema, "product")
  //Creating Sales Chart Algorithm 
  //Sales.find().distinct('title', async function (error, titles) {
    if (error) return console.error(error);
    const resProm = await Promise.all([
      Sales.aggregate(
        [{$match : { title : product.title }},
          { $group: {
              _id: { month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
              title: { $first: "$title" },
              month: { $first: { $month: "$date" } },
              count: { $sum: 1 }
            },
    
          }
        ],
        )]);
    
    console.log(resProm);
    //Defining Variables for Month
    var d = new Date();
    var n = d.getMonth() + 1;
    var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];
    //Creating algorithm to fix mongoDB date differiences (For example : in Mongodb 1st of Jan will be listed at December 2018 instead for 1st Jan of 2019)
    var charDataArra = [];
    var idElement = 0;

      tmpArra = new Array(12).fill(0);;
      var monthInd = 1;
  
      resProm[0].forEach(charData => {
          tmpArra[charData.month - 1] = charData.count 


      });
      charDataArra.push(tmpArra);

  
     //Testing for Data
     console.log(charDataArra);
     console.log(Month);
     console.log(product.title);
// });
res.render('productanalyticpage',{prod: product, data:charDataArra, mon:Month});
//res.render product is rendering the product 'product'
       });
       
});

module.exports = router;