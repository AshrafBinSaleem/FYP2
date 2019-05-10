var express = require('express');
var router = express.Router();

//Rending Store Page
router.get('/', function(req, res, next) {
  res.render('comment', { title: 'Express' });
// creating a var model using mongoose.model function
var Comment = mongoose.model('comments', commentsSchema,"comments");
//product.findOne is a function to match variable like _id : id (_id variable is listed at the mongoUtils)
Comment.find(function(error, comments){
        if (error) return console.error(error);
        console.log(comments);
       //ejs page rendering
        res.render('comment');
//res.render product is rendering the product 'product'

});
});
module.exports = router;

