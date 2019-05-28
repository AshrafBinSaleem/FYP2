//This is where we setup up and connect mongoDB to our server
var _db;

module.exports = {

  connectToServer: function( callback ) {
    mongoose.connect('mongodb://localhost/fypdb', { useNewUrlParser: true });
    _db = mongoose.connection;
    _db.on('error', console.error.bind(console, 'connection error:'));
    _db.once('open', function () {
        console.log("Succesfully connected to database");
    });


      return callback(  );

  },

  getDb: function() {
    return _db;
  }
};