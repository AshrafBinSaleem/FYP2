var express = require('express');
var router = express.Router();

//Rending Store Page
router.get('/', function(req, res, next) {
  res.render('storepage', { title: 'Express' });
});

module.exports = router;
