
global.productSchema = new mongoose.Schema({
    title: String,
    developer: String, 
    publisher: String, 
    date: Date,
    price: Number,
    review_Score: Number,
    desc: String,
    introduction: String,
    setting: String,
    imageLink: String,
    play_Mode: String,
    type: Array,
  });