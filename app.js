var mongoUtil = require('./mongoUtils');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
global.mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var storepageRouter = require('./routes/storepage');
var productpageRouter = require('./routes/productpage');
var testPage = require('./routes/testpage');
var app = express();

//Define global
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

mongoUtil.connectToServer(function () {


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  //app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/', storepageRouter);
  app.use('/product',productpageRouter);
  app.use('/test',testPage);
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

// start the rest of your app here