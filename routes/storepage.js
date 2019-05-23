var express = require('express');
var router = express.Router();
var authen  = require('../authentication');
//Rending Store Page
router.get('/',authen.isLoggedIn, function(req, res, next) {
  res.render('storepage', { title: 'Express' });
});

module.exports = router;
