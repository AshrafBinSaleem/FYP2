var express = require('express');
var router = express.Router();
var authen  = require('../authentication');

//Rending login page
router.get('/',authen.isLoggedIn, function(req, res, next) {
  res.render('comparepage', { title: 'Express' });
});

module.exports = router;
