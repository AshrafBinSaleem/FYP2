var express = require('express');
var router = express.Router();

//Getting the :id of of the object from the database _id [EJS templating uses it to load objects data]
router.get('/:id', function(req, res, next) {
   //creating an variable id to match object ID
   var id = new require('mongodb').ObjectID(req.params.id);
   //Creating a var model using mongoose.model function
     var Product = mongoose.model('product', productSchema,"product");
     var Comment = mongoose.model('comments', commentsSchema,"comments");

   //Product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
     Product.findOne({_id: id}, async function(error, product){
           if (error) return console.error(error);
           console.log(product);
        

      
  //Declaring MongoUtils and getting Db
  var mongoUtil = require('../mongoUtils');
   //May not need (3)
  var db = mongoUtil.getDb();

  //Declaring ID = ID in mongoDB
  //var id = new require('mongodb').ObjectID(req.params.id);
  
  //Declaring Sales as the mongoose.model (salesSchema)
  var Sales = mongoose.model('sales', salesSchema, "sales");

  //Declaring Comment as the mongoose.model (commentSchema)
  var Comment = mongoose.model('comments', commentsSchema,"comments");

  //Creating Sales Chart Algorithm for individual products
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
    
    //May not need (1)
    var idElement = 0;

      tmpArra = new Array(12).fill(0);;
      //May not need (2)
      var monthInd = 1;
  
      resProm[0].forEach(charData => {
          tmpArra[charData.month - 1] = charData.count 


      });
      charDataArra.push(tmpArra);

//Review system

const reviewProm = await Promise.all([
  Comment.aggregate(
    [{$match : { title : product.title }},
      { $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, reviewscore: "$reviewscore" },
          reviewscore: { $first: "$reviewscore" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      }
    ],
    )]);
    console.log(reviewProm);

    //ReviewDataFull [star][month] <--- dimension
    var reviewDataFull = [];
    for(var i = 0; i < 5; i++){
    var reviewData = new Array(12).fill(0);
    reviewDataFull.push(reviewData);
  }
    reviewProm[0].forEach(revdata => {
      reviewDataFull[revdata.reviewscore - 1][revdata.month - 1] = revdata.count;
    });
    console.log(reviewDataFull)

    //adding 
     //Product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
  //Matching _idL with id
  Product.findOne({_id: id},async function(error, product){
    if (error) return console.error(error);
    const commentProm = await Promise.all([
      Comment.aggregate([
        {$match : { title : product.title }} 
      ])
    ]);
//Creating a promise for rating (star rating system for review)
    const ratingProm = await Promise.all([
      Comment.aggregate([
        {$match : { title : product.title }},
        {$group: {_id: {reviewscore:"$reviewscore"},
        count: { $sum: 1 } 
      }
      } 
      ])
    ]);

//Creating the rating count for each star level form one to five stars
    var rating = new Array(5).fill(0);
    ratingProm[0].forEach(element => {
      rating[element._id.reviewscore - 1] = element.count;
    });
    //Rendering Page
    res.render('productanalyticpage',{prod: product, data:charDataArra, mon:Month, reviewData: reviewDataFull,comm: commentProm[0], id: id});
       });
      });   
});

module.exports = router;