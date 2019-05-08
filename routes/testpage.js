//Testing Page
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {

  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();

  var id = new require('mongodb').ObjectID(req.params.id);

  var Sales = mongoose.model('sales', salesSchema, "sales");

  var Product = mongoose.model('product', productSchema, "product"); 

  Sales.find().distinct('title', async function (error, titles) {
    if (error) return console.error(error);
    const resProm = await Promise.all([
      Sales.aggregate([{
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
          title: { $first: "$title" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      }, { $sort: { title: 1, month: 1 } }])
    ]);



    var d = new Date();
    var n = d.getMonth() + 1;

    var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];

    var charDataArra = [];
    var idElement = 0;
    titles.forEach(element => {
      tmpArra = new Array(12).fill(0);;
      var monthInd = 1;
      //console.log(element); 
      resProm[0].forEach(charData => {
        if (charData.title == element) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      charDataArra.push(tmpArra);
    });

    var columnType = [];
    var titleNew = []
    columnType.push("'string'");
    titleNew.push("'Month'");

    for (let index = 0; index < titles.length; index++) {
     titleNew.push( "'" + titles[index] +"'");
     columnType.push("'number'");
    }

    console.log(charDataArra);
    console.log(Month);
    console.log(titles);

    const resSalesProm = await Promise.all([
      Sales.aggregate([{
        $lookup: {
          from : "product" ,
          localField : "title",
          foreignField : "title",
          as: "productDetails"
        }},{
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, playmode: "$productDetails.play_Mode" },
          playmode: { $first: "$productDetails.play_Mode" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      } ])
    ]);

    var gameType = ['SinglePlayer', 'MultiPlayer', 'Both']; 
    var playModeArra = [];
    gameType.forEach(element => {
      tmpArra = new Array(12).fill(0);;

      resSalesProm[0].forEach(charData => {
        if (charData.playmode[0] == element) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      playModeArra.push(tmpArra);
    });

    gametypeout = ["'Month'","'SinglePlayer'", "'MultiPlayer'", "'Both'"]
    gametitlecolumntype = ["'string'","'number'","'number'","'number'"]

    /** Developer graph */
    const resDevelopProm = await Promise.all([
      Sales.aggregate([{
        $lookup: {
          from : "product" ,
          localField : "title",
          foreignField : "title",
          as: "productDetails"
        }},{
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, developer: "$productDetails.developer" },
          developer: { $first: "$productDetails.developer" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      } ])
    ]);

    var resDeveloper = await Promise.all([
      Product.aggregate([{
        $group: {
          _id: { developer: "$developer" },
          developer: { $first: "$developer" }
        },
      } ])
    ]);

    console.log(resDeveloper[0]);
    var developDataArra = [];
    var idElement = 0;
    resDeveloper[0].forEach(element => {
      tmpArra = new Array(12).fill(0);;
      var monthInd = 1;
      //console.log(element); 
      resDevelopProm[0].forEach(charData => {
        if (charData.developer == element.developer) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      developDataArra.push(tmpArra);
    });

    console.log(resDevelopProm[0]);
    console.log(developDataArra);

    res.render('testpage', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType, playmodedata : playModeArra, gametitle : gametypeout, gamecoltype : gametitlecolumntype });

  })



});




module.exports = router;
