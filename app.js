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
var emptytestpageRouter = require('./routes/emptytestpage')
var loginRouter = require('./routes/loginpage');
var registerRouter = require('./routes/registerpage')
var usersRouter = require('./routes/users');
var storepageRouter = require('./routes/storepage');
var productpageRouter = require('./routes/productpage');
var testPage = require('./routes/testpage');
var app = express();
var analyticspageRouter = require('./routes/analyticpage')
var commentRouter = require('./routes/comment')

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

app.post("/product", function(req, res){
  console.log("TEST TEST TEST");
  var commentModel = mongoose.model('comment', commentsSchema);
  var comment = new commentModel({title: req.body.gametitle,comment: req.body.comment,reviewscore: req.body.reviewscore, date: new Date(),customer: req.user.username })
  
  // newcomment.title = req.body.gametitle;
  // newcomment.comment = req.body.comment;
  // newcomment.reviewscore = 5;
  // //  req.body.score;
  // newcomment.date = new Date;
  // newcomment.customer = req.body.username;
  comment.save(function(err) {
    if (err) {
        console.log(err);
        res.send(err);
    } else {
      
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

//login check [Not in use] (you need app.get to use it)
function isLoggedIn(req,res,next){
  if(req.authenticate()){
    return next();
  }
  res.redirect("/login");
}
app.use(bodyParser.urlencoded({extended:true}));

//empty test post
app.post("/etest", function(req,res){
  console.log("ashraf");
  res.end();
});

//Define global for our Schema
global.productSchema = new mongoose.Schema({
  title: String,
  developer: String, 
  publisher: String, 
  date: Date,
  price: Number,
  review_Score: Number,
  desc: String,
  introduction: String,
  setting: String,
  imageLink: String,
  play_Mode: String,
  type: Array,
});

global.companySchema = new mongoose.Schema({
  name: String
});

global.salesSchema = new mongoose.Schema({
  title: String,
  customer: String,
  date: Date,
  price: Number,
});

global.commentsSchema = new mongoose.Schema({
  title: String,
  customer: String,
  comment: String,
  reviewscore: Number,
  date: Date
});
//Contacting to Mongo DB and setting items that are to be connected to it
mongoUtil.connectToServer(function () {


  // view engine setup
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
  app.use('/test',testPage);
  app.use('/analytics',analyticspageRouter);
  app.use('/login', loginRouter);
  app.use('/register', registerRouter);
  app.use('/productanalytic', productanalyticpageRouter);
  app.use('/comment',commentRouter);
  app.use('/etest',emptytestpageRouter);
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


});

module.exports = app;

