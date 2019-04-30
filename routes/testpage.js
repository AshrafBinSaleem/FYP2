var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {

  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();

  var id = new require('mongodb').ObjectID(req.params.id);

  var Sales = mongoose.model('sales', salesSchema, "sales");

  // Sales.aggregate([{
  //   $group: {
  //     _id : {MaxMonth: { $max : { $month: "$date"} }, year: { $max : {$year: "$date"} } }
  //     }
  // }],function(err, obj)
  // {
  //   console.log(obj);
  // })


  // Sales.aggregate([{
  //   $group: {
  //     _id : {month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
  //     title : {$first : "$title"} ,
  //     month : {$first : {$month: "$date"} }, 
  //     count: { $sum: 1 }
  //     },

  // },
  // {$sort : {title: 1, month: 1 }}],function(err, obj)
  // {
  //   var d = new Date();
  //   var n = d.getMonth()+1;
  //   console.log("Month : ",n);
  //   console.log(obj.find().distinct('title'));
  //   console.log(obj);
  // })

  // var salesprom = Sales.aggregate([{
  //   $group: {
  //     _id : {month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
  //     title : {$first : "$title"} ,
  //     month : {$first : {$month: "$date"} }, 
  //     count: { $sum: 1 }
  //     },

  // },
  // {$sort : {title: 1, month: 1 }}]);



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
    //console.log("N:", n);
    var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];
    //console.log(resProm[0][0].count)
    // salesprom.then(function (doc) {
    //   console.log(doc)
    // });
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
    // resSalesProm[0].forEach(element => {
    //   console.log(element.productDetails[0].play_Mode)
    //   if(element.productDetails[0].play_Mode == "SinglePlayer"){
    //     gameTypeCount[0] += 1;
    //   }
    //   else if(element.productDetails[0].play_Mode == "MultiPlayer"){
    //     gameTypeCount[1] += 1;
    //   }
    //   else if(element.productDetails[0].play_Mode == "Both"){
    //     gameTypeCount[2] += 1;
    //   }
      
    // });
    
    console.log(playModeArra);

    res.render('testpage', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType, playmodedata : playModeArra, gametitle : gametypeout, gamecoltype : gametitlecolumntype });

  })

  // Sales.find( async function (error, sales) {
  //   if (error) return console.error(error);
  //   const resProm = await Promise.all([
  //     Sales.aggregate([{
  //       $lookup: {
  //         from : "product" ,
  //         localField : "title",
  //         foreignField : "title",
  //         as: "productDetails"
        
  //       }

  //     } ])
  //   ]);

  //   console.log(resProm[0][0].productDetails[0].play_Mode);

  //   var d = new Date();
  //   var n = d.getMonth() + 1;
  //   //console.log("N:", n);
  //   var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];
  //   //console.log(resProm[0][0].count)
  //   // salesprom.then(function (doc) {
  //   //   console.log(doc)
  //   // });
  //   // var gameType = ['Single', 'Multiplayer', 'Both']; 
  //   var gameTypeCount = [0,0,0];
  //   // var charDataArra = [];
  //   // var idElement = 0;
  //   resProm[0].forEach(element => {
  //     console.log(element.productDetails[0].play_Mode)
  //     if(element.productDetails[0].play_Mode == "SinglePlayer"){
  //       console.log("1");
  //       gameTypeCount[0] += 1;
  //     }
  //     else if(element.productDetails[0].play_Mode == "MultiPlayer"){
  //       console.log("2");
  //       gameTypeCount[1] += 1;
  //     }
  //     else if(element.productDetails[0].play_Mode == "Both"){
  //       console.log("3");
  //       gameTypeCount[2] += 1;
  //     }
  //     console.log(gameTypeCount)
  //     // tmpArra = new Array(12).fill(0);;
  //     // var monthInd = 1;
  //     // //console.log(element); 
  //     // resProm[0].forEach(charData => {
  //     //   if (charData.title == element) {
  //     //     tmpArra[charData.month - 1] = charData.count 

  //     //   }

  //     // });
  //     // charDataArra.push(tmpArra);
  //   });

  //   // var columnType = [];
  //   // var titleNew = []
  //   // columnType.push("'string'");
  //   // titleNew.push("'Month'");

  //   // for (let index = 0; index < titles.length; index++) {
  //   //  titleNew.push( "'" + titles[index] +"'");
  //   //  columnType.push("'number'");
  //   // }

  //   // console.log(charDataArra);
  //   // console.log(Month);
  //   // console.log(titles);
    
  //   // res.render('testpage', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType});

  // })
  //   const res = await Promise.all([
  //     Sales.find().distinct('title'),
  //     Sales.aggregate([{
  //       $group: {
  //         _id : {month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
  //         title : {$first : "$title"} ,
  //         month : {$first : {$month: "$date"} }, 
  //         count: { $sum: 1 }
  //         },

  //     },{$sort : {title: 1, month: 1 }}])
  //   ]);

  // console.log(res);
  //   var Product = mongoose.model('product', productSchema,"product");


  //     Product.findOne({title: "Sekiro"}, function(error, product){
  //         if (error) return console.error(error);
  //         console.log(product);
  //         var Company = mongoose.model('company', companySchema,"company");

  //         Company.findOne({_id: product.publisher}, function(error, company) {
  //             console.log(company);
  //             res.render('testpage',{mgobj: product});
  //         });

  // });


});




module.exports = router;
