//Setting up router, express and mongoose
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var authen  = require('../authentication');

/* GET home page. */
router.get('/', authen.isLoggedIn, function (req, res, next) {

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
        //Grouping by ID, Title, Month And Count
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, title: "$title" },
          title: { $first: "$title" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },
        //Sorting by Title and Month
      }, { $sort: { title: 1, month: 1 } }])
    ]);


  //Defining Variables for Month

  //May not need (1)
    var d = new Date();
    var n = d.getMonth() + 1;

    //Declaring Months 
    var Month = ["'Jan'", "'Feb'" , "'March'", "'April'", "'June'" , "'July'", "'May'" , "'Aug'", "'Stp'", "'Oct'", "'Nov'", "'Dec'"];
    //Creating algorithm to fix mongoDB date differiences (For example : in Mongodb 1st of Jan will be listed at December 2018 instead for 1st Jan of 2019)
    var charDataArra = [];

      //May not need (2)
    var idElement = 0;

    titles.forEach(element => {
      tmpArra = new Array(12).fill(0);;

      //May not need (3)
      var monthInd = 1;

      //Creating a Mongoose promise named Res to get sales data
      resProm[0].forEach(charData => {
        if (charData.title == element) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      charDataArra.push(tmpArra);
    });

    //Code for Sales Graph
    var columnType = [];
    var titleNew = []
    columnType.push("'string'");
    titleNew.push("'Month'");

    for (let index = 0; index < titles.length; index++) {
     titleNew.push( "'" + titles[index] +"'");
     columnType.push("'number'");
    }

    //Code for Play Mode (Basically singleplayer, Multiplayer etc) 
    //Creating another Res promise for sales in regards to PlayMode
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

    //Code for Gerne Chart (Aka Type like RPG, Action etc)
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

    //Grouping the data by ID and Type
    var typeArra = await Promise.all([
      Product.aggregate([{
        $group: {
          _id: {  type: "$type" },
          type: { $first: "$type" }
        },

      } ])
    ]);

    //Storing the eg : [0,1,0] (Example : [0, 1 , 0], the first zero would mean 0 sales for January), data sales per month 
    var storageForType = [];
    
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

    for (let index = 0; index < titles.length; index++) {
     titleNew.push( "'" + titles[index] +"'");
     columnType.push("'number'");
    }

    //Developer chart
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
    
    //May not need (4)
     var idElement = 0;
    resDeveloper[0].forEach(element => {
      tmpArra = new Array(12).fill(0);;
    //May not need (5)
      var monthInd = 1;
      resDevelopProm[0].forEach(charData => {
        if (charData.developer == element.developer) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      developDataArra.push(tmpArra);
      DeveloperHeader.push("'" + element.developer + "'")
      DeveloperColumnType.push("'number'");
    });
    
    //Publisher chart
    const resPublisherProm = await Promise.all([
      Sales.aggregate([{
        $lookup: {
          from : "product" ,
          localField : "title",
          foreignField : "title",
          as: "productDetails"
        }},{
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" }, publisher: "$productDetails.publisher" },
          publisher: { $first: "$productDetails.publisher" },
          month: { $first: { $month: "$date" } },
          count: { $sum: 1 }
        },

      } ])
    ]);

    var resPublisher= await Promise.all([
      Product.aggregate([{
        $group: {
          _id: { publisher: "$publisher" },
          publisher: { $first: "$publisher" }
        },
      } ])
    ]);
    
    var PublisherColumnType = [];
    var PublisherHeader = [];
    PublisherColumnType.push("'string'");
    PublisherHeader.push("'Month'")

    console.log(resPublisher[0]);
    var publisherDataArra = [];
    
    //May not need (4)
     var idElement = 0;
     resPublisher[0].forEach(element => {
      tmpArra = new Array(12).fill(0);;
    //May not need (5)
      var monthInd = 1;
      resPublisherProm[0].forEach(charData => {
        if (charData.publisher == element.publisher) {
          tmpArra[charData.month - 1] = charData.count 

        }

      });
      publisherDataArra.push(tmpArra);
      PublisherHeader.push("'" + element.publisher + "'")
      PublisherColumnType.push("'number'");
    });

    //Rending page and data provided.
    res.render('analytics', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType, 
      playmodedata : playModeArra, gametitle : gametypeout, gamecoltype : gametitlecolumntype,
     genreData: storageForType, genreHeader: GenreHeader, genreColumnType : GenreColumnType, 
     developerData : developDataArra, developerHeader : DeveloperHeader, developerColumnType : DeveloperColumnType,
     pubilsherData : publisherDataArra, publisherHeader : PublisherHeader, publisherColumnType : PublisherColumnType
    });

  })

  


});




module.exports = router;