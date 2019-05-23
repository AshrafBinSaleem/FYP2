var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function (req, res, next) {
 //creating an variable id to match object ID
  var id = new require('mongodb').ObjectID(req.params.id);
// creating a var model using mongoose.model function
  var Comment = mongoose.model('comments', commentsSchema,"comments");
  var Product = mongoose.model('product', productSchema,"product");
//product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
  Product.findOne({_id: id},async function(error, product){
        if (error) return console.error(error);
        console.log(product);
        const commentProm = await Promise.all([
          Comment.aggregate([
            {$match : { title : product.title }} 
          ])
        ]);
        console.log(commentProm);
        const ratingProm = await Promise.all([
          Comment.aggregate([
            {$match : { title : product.title }},
            {$group: {_id: {reviewscore:"$reviewscore"},
            count: { $sum: 1 } 
          }
          } 
          ])
        ]);
        console.log(ratingProm[0]);

        var rating = new Array(5).fill(0);
        ratingProm[0].forEach(element => {
          rating[element._id.reviewscore - 1] = element.count;
        });

        console.log(rating);
        
        res.render('product',{prod: product, comm: commentProm[0], id: id, reviewRating: rating});
//res.render product is rendering the product 'product'
    });
 
});

module.exports = router;
