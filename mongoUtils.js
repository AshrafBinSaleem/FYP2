//var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    mongoose.connect('mongodb://localhost/fypdb', { useNewUrlParser: true });
    _db = mongoose.connection;
    _db.on('error', console.error.bind(console, 'connection error:'));
    _db.once('open', function () {
        console.log("succesfully connected");
    });

    //MongoClient.connect( "mongodb://localhost:27017", function( err, client ) {
    //  _db = client.db('fypdb');
      return callback(  );
    //} );
  },

  getDb: function() {
    return _db;
  }
};