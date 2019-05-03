var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var mongoUtil = require('../mongoUtils');
    var db = mongoUtil.getDb();
  
    var id = new require('mongodb').ObjectID(req.params.id);
  
    var Sales = mongoose.model('sales', salesSchema, "sales");

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
    res.render('analytics', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType});

});    
// res.render('analytics', { tit: titleNew, mon : Month, data: charDataArra ,coltype : columnType});

}
)


module.exports = router;