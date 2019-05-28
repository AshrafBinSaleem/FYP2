//Creating a variable to Define nessercaily tools/libraries
var mongoUtil = require('./mongoUtils');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
global.mongoose = require('mongoose');

//Creating Routing Page
var productanalyticpageRouter = require('./routes/productanalyticpage');
var loginRouter = require('./routes/loginpage');
var registerRouter = require('./routes/registerpage')
var usersRouter = require('./routes/users');
var storepageRouter = require('./routes/storepage');
var productpageRouter = require('./routes/productpage');
var app = express();
var analyticspageRouter = require('./routes/analyticpage')
var commentRouter = require('./routes/comment')
var buypageRouter = require('./routes/buypage')
var thankyouRouter = require('./routes/thankyou')
var dummyRouter = require('./routes/dummypage')
//Authentication Code
//Part 1
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");
})
//Part 2
app.use(require("express-session")({
  secret: "HELLO YOU",
  resave: false,
  saveUninitialized: false
}));
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));

//Part 3
//handling user registeration and redirecting to store front.
app.post("/register", function(req, res){
 
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    });
  });
});
//Comment 
app.post("/product", function(req, res){
  console.log("Calling comment post");
  var commentModel = mongoose.model('comment', commentsSchema);
  var comment = new commentModel({title: req.body.gametitle,comment: req.body.comment,reviewscore: req.body.reviewscore, date: new Date(),customer: req.user.username })
  
  comment.save(function(err) {
    if (err) {
        console.log(err);
        res.send(err);
    } else {
      res.redirect('/product/' + req.body.gameid )
    }
});
});
//Confirm purchase
app.post("/buy", function(req, res){
  console.log("Confirm");
  var salesModel = mongoose.model('sales', salesSchema);
  var sales = new salesModel({title: req.body.gametitle, customer: req.user.username, date: new Date(), price: req.body.gameprice })
  
  sales.save(function(err) {
    if (err) {
        console.log(err);
        res.send(err);
    } else {
      res.redirect('/thankyou/' + req.body.gameid)
    }
});
});

//Login logic part 
//Middleware
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res){

});

//Logout
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

//Login check [Not in use] (you need app.get to use it)
function isLoggedIn(req,res,next){
  if(req.authenticate()){
    return next();
  }
  res.redirect("/login");
}
app.use(bodyParser.urlencoded({extended:true}));

//Define global for our Schema
//Product Schema
global.productSchema = new mongoose.Schema({
  title: String,
  developer: String, 
  publisher: String, 
  date: Date,
  price: Number,
  rating: String,
  desc: String,
  introduction: String,
  setting: String,
  imageLink: String,
  play_Mode: String,
  type: Array,
});
//Company Schema
global.companySchema = new mongoose.Schema({
  name: String
});
//Sales Schema
global.salesSchema = new mongoose.Schema({
  title: String,
  customer: String,
  date: Date,
  price: Number,
});
//Comment Schema
global.commentsSchema = new mongoose.Schema({
  title: String,
  customer: String,
  comment: String,
  reviewscore: Number,
  date: Date
});
//Contacting to Mongo DB and setting items that are to be connected to it
mongoUtil.connectToServer(function () {


  //View engine setup aka templating tool
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  //Declaring which router will use which template
  app.use('/users', usersRouter);
  app.use('/', storepageRouter);
  app.use('/product',productpageRouter);
  app.use('/analytics',analyticspageRouter);
  app.use('/login', loginRouter);
  app.use('/register', registerRouter);
  app.use('/productanalytic', productanalyticpageRouter);
  app.use('/comment',commentRouter);
  app.use('/buy',buypageRouter);
  app.use('/thankyou',thankyouRouter );
  app.use('/dummy',dummyRouter);
  //Catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  //Error handler
  app.use(function (req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //Render the error page
    res.status(err.status || 500);
    res.render('error');
  });


});

module.exports = app;

