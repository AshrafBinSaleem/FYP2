    
//Settping up router, express and mongoose
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function (req, res, next) {

  //Declaring MongoUtils and getting Db
  var mongoUtil = require('../mongoUtils');
  var db = mongoUtil.getDb();

  //Declaring ID = ID in mongoDB
  var id = new require('mongodb').ObjectID(req.params.id);
  
  //Declaring Sales as the mongoose.model (salesSchema)
  var Sales = mongoose.model('sales', salesSchema, "sales");
  //Declaring Product as the mongoose.modle (productSchema)
  var Product = mongoose.model('product', productSchema, "product")
  //Creating Sales Chart Algorithm 
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


  //Defining Variables for Month
    var d = new Date();
    var n = d.getMonth() + 1;
    var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];
    //Creating algorithm to fix mongoDB date differiences (For example : in Mongodb 1st of Jan will be listed at December 2018 instead for 1st Jan of 2019)
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

    //Code for Line Graph
    var columnType = [];
    var titleNew = []
    columnType.push("'string'");
    titleNew.push("'Month'");

    for (let index = 0; index < titles.length; index++) {
     titleNew.push( "'" + titles[index] +"'");
     columnType.push("'number'");
    }
    //Testing for Data
    console.log(charDataArra);
    console.log(Month);
    console.log(titles);

    //Code for Play Mode (Basically singleplayer, Multiplayer etc) 
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

    //Continuation for Play Mode [Handling months]

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

    //Continuation for Play Mode [Handling columns, type and month etc]

    gametypeout = ["'Month'","'SinglePlayer'", "'MultiPlayer'", "'Both'"]
    gametitlecolumntype = ["'string'","'number'","'number'","'number'"]

    console.log(playModeArra);

    //Code for Gerne Chart (Aka Type)
     const genreSalesProm = await Promise.all([
      Sales.aggregate([{
        $lookup: {
          from : "product" ,
          localField : "title",
          foreignField : "title",
          as: "productDetails"
        }},{
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, type: "$productDetails.type" },
          type: { $first: "$productDetails.type" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      } ])
    ]);
    //Checking the code before grouping them.
    console.log("Genre check");
    console.log(genreSalesProm[0]);
    var typeArra = await Promise.all([
      Product.aggregate([{
        $group: {
          _id: {  type: "$type" },
          type: { $first: "$type" }
        },

      } ])
    ]);
    //Storing the [0,1,0] : data sales per month 
    var storageForType = [];
    console.log("check point 1");
    console.log(typeArra);

    var GenreColumnType = [];
    var GenreHeader = [];
    GenreColumnType.push("'string'");
    GenreHeader.push("'Month'");

     typeArra[0].forEach(element =>{
       tmpArra = new Array(12).fill(0);

       genreSalesProm[0].forEach(charData =>{
        if (charData.type[0] == element.type) {
         tmpArra[charData.month - 1] = charData.count;
        }
       });
       storageForType.push(tmpArra);
       GenreHeader.push("'" + element.type + "'")
       GenreColumnType.push("'number'");
     });

     //Checking each Data Log
     console.log("check point 2");
     console.log(storageForType);
     console.log(GenreHeader);
     console.log(GenreColumnType);
    

    for (let index = 0; index < titles.length; index++) {
     titleNew.push( "'" + titles[index] +"'");
     columnType.push("'number'");
    }

    //Developer chart
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
    
    var DeveloperColumnType = [];
    var DeveloperHeader = [];
    DeveloperColumnType.push("'string'");
    DeveloperHeader.push("'Month'")

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
      DeveloperHeader.push("'" + element.developer + "'")
      DeveloperColumnType.push("'number'");
    });
    //Checking Developer Chart
    console.log(DeveloperHeader);
    console.log(DeveloperColumnType);
    console.log(resDevelopProm[0]);
    console.log(developDataArra);
    
    //Rending page and data provided.
    res.render('analytics', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType, 
      playmodedata : playModeArra, gametitle : gametypeout, gamecoltype : gametitlecolumntype,
     genreData: storageForType, genreHeader: GenreHeader, genreColumnType : GenreColumnType, 
     developerData : developDataArra, developerHeader : DeveloperHeader, developerColumnType : DeveloperColumnType  });

  })

  


});




module.exports = router;