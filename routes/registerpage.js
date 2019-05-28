var express = require('express');
var router = express.Router();

//Rendering register Page
router.get('/',function(req, res, next) {
  res.render('registerpage', { title: 'Express' });
});

module.exports = router;
