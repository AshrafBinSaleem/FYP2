var express = require('express');
var router = express.Router();

//Rending login page
router.get('/', function(req, res, next) {
  res.render('loginpage', { title: 'Express' });
});

module.exports = router;
