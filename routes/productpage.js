var express = require('express');
var router = express.Router();

//Getting the :id of of the object from the database _id [EJS templating uses it to load objects data]
router.get('/:id', function (req, res, next) {

 //Creating an variable id to match object ID
  var id = new require('mongodb').ObjectID(req.params.id);

//Creating a var model using mongoose.model function for comments and products
  var Comment = mongoose.model('comments', commentsSchema,"comments");
  var Product = mongoose.model('product', productSchema,"product");

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
        console.log(product)
        //res.render product is rendering the product 'product'
        res.render('product',{prod: product, comm: commentProm[0], id: id, reviewRating: rating});
    });
 
});

module.exports = router;
